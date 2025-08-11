import mongoose from 'mongoose'
import User from '../User.js'

// Mock MongoDB connection for tests
jest.mock('../../lib/database.js')

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({})
  })

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      }

      const user = new User(userData)
      const savedUser = await user.save()

      expect(savedUser.email).toBe('test@example.com')
      expect(savedUser.firstName).toBe('John')
      expect(savedUser.lastName).toBe('Doe')
      expect(savedUser.role).toBe('user')
      expect(savedUser.isActive).toBe(true)
      expect(savedUser.password).not.toBe('Password123') // Should be hashed
    })

    it('should hash password before saving', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      })

      await user.save()
      expect(user.password).not.toBe('Password123')
      expect(user.password.length).toBeGreaterThan(20) // Hashed password is longer
    })

    it('should not create user with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      }

      await new User(userData).save()
      
      const duplicateUser = new User(userData)
      await expect(duplicateUser.save()).rejects.toThrow()
    })

    it('should require all mandatory fields', async () => {
      const user = new User({
        email: 'test@example.com'
        // Missing required fields
      })

      await expect(user.save()).rejects.toThrow()
    })
  })

  describe('User Methods', () => {
    let user

    beforeEach(async () => {
      user = new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      })
      await user.save()
    })

    it('should compare password correctly', async () => {
      const isValid = await user.comparePassword('Password123')
      expect(isValid).toBe(true)

      const isInvalid = await user.comparePassword('WrongPassword')
      expect(isInvalid).toBe(false)
    })

    it('should find user by email', async () => {
      const foundUser = await User.findByEmail('test@example.com')
      expect(foundUser).toBeTruthy()
      expect(foundUser.email).toBe('test@example.com')

      const notFound = await User.findByEmail('notfound@example.com')
      expect(notFound).toBeNull()
    })

    it('should not include password in JSON output', () => {
      const userJSON = user.toJSON()
      expect(userJSON.password).toBeUndefined()
      expect(userJSON.email).toBe('test@example.com')
    })
  })

  describe('User Preferences', () => {
    it('should set default preferences', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      })

      await user.save()

      expect(user.preferences.language).toBe('fr')
      expect(user.preferences.theme).toBe('light')
      expect(user.preferences.defaultLLM).toBe('openai')
    })

    it('should validate preference values', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        preferences: {
          language: 'invalid-lang'
        }
      })

      await expect(user.save()).rejects.toThrow()
    })
  })
})
