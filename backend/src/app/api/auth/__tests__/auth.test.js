import { POST as loginPOST } from '../login/route.js'
import { POST as registerPOST } from '../register/route.js'
import mongoose from 'mongoose'
import User from '../../../../models/User.js'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
    }))
  }
}))

describe('Authentication API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'Password123',
          firstName: 'John',
          lastName: 'Doe'
        })
      }

      const response = await registerPOST(mockRequest)
      const data = await response.json()

      expect(data.message).toBe('Compte créé avec succès')
      expect(data.user.email).toBe('test@example.com')
      expect(data.accessToken).toBeDefined()
      expect(data.refreshToken).toBeDefined()
    })

    it('should reject registration with invalid email', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'invalid-email',
          password: 'Password123',
          firstName: 'John',
          lastName: 'Doe'
        })
      }

      const response = await registerPOST(mockRequest)
      expect(response.status).toBe(500)
    })

    it('should reject registration with weak password', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: '123',
          firstName: 'John',
          lastName: 'Doe'
        })
      }

      const response = await registerPOST(mockRequest)
      expect(response.status).toBe(500)
    })

    it('should reject duplicate email registration', async () => {
      // Create first user
      await new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      }).save()

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'Password456',
          firstName: 'Jane',
          lastName: 'Smith'
        })
      }

      const response = await registerPOST(mockRequest)
      expect(response.status).toBe(409)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      }).save()
    })

    it('should login with valid credentials', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'Password123'
        })
      }

      const response = await loginPOST(mockRequest)
      const data = await response.json()

      expect(data.message).toBe('Connexion réussie')
      expect(data.user.email).toBe('test@example.com')
      expect(data.accessToken).toBeDefined()
      expect(data.refreshToken).toBeDefined()
    })

    it('should reject login with invalid email', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'notfound@example.com',
          password: 'Password123'
        })
      }

      const response = await loginPOST(mockRequest)
      expect(response.status).toBe(401)
    })

    it('should reject login with invalid password', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'WrongPassword'
        })
      }

      const response = await loginPOST(mockRequest)
      expect(response.status).toBe(401)
    })

    it('should reject login for inactive user', async () => {
      // Deactivate user
      await User.findOneAndUpdate(
        { email: 'test@example.com' },
        { isActive: false }
      )

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'Password123'
        })
      }

      const response = await loginPOST(mockRequest)
      expect(response.status).toBe(401)
    })
  })
})
