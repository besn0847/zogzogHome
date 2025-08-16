// Test setup utilities
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import User from '../src/models/User.js'
import Collection from '../src/models/Collection.js'
import Document from '../src/models/Document.js'

// Note: Mongoose warnings about 'collection' field are expected in tests

let mongoServer

// Setup in-memory MongoDB for tests
export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  await mongoose.connect(mongoUri)
}

// Cleanup test database
export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  }
  
  if (mongoServer) {
    await mongoServer.stop()
  }
}

// Clear all collections between tests
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections
  
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}

// Create test user
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashedpassword123',
    isEmailVerified: true
  }
  
  const user = new User({ ...defaultUser, ...userData })
  await user.save()
  return user
}

// Create test collection
export const createTestCollection = async (userId, collectionData = {}) => {
  const defaultCollection = {
    name: 'Test Collection',
    description: 'A test collection',
    color: '#3B82F6',
    createdBy: userId,
    isPublic: false
  }
  
  const collection = new Collection({ ...defaultCollection, ...collectionData })
  await collection.save()
  return collection
}

// Create test document
export const createTestDocument = async (userId, collectionId, documentData = {}) => {
  const defaultDocument = {
    title: 'Test Document',
    filename: 'test.pdf',
    originalFileName: 'test.pdf',
    filePath: '/test/path/test.pdf',
    markdownContent: '# Test Document\n\nThis is a test document.',
    fileSize: 1024,
    mimeType: 'application/pdf',
    processingStatus: 'completed', // Use correct field name from Document model
    uploadedBy: userId,
    collection: collectionId
  }
  
  // Merge default with provided data, ensuring processingStatus is properly set
  const documentToCreate = { ...defaultDocument, ...documentData }
  const document = new Document(documentToCreate)
  await document.save()
  return document
}

// Generate JWT token for test user
export const generateTestToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET || 'test-jwt-secret',
    { expiresIn: '1h' }
  )
}

// Create authorization header
export const createAuthHeader = (token) => {
  return { Authorization: `Bearer ${token}` }
}

// Mock request object
export const createMockRequest = (options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    params = {},
    query = {}
  } = options

  return {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    json: async () => body,
    nextUrl: {
      searchParams: new URLSearchParams(query)
    },
    ...params
  }
}

// Mock response assertions
export const expectSuccessResponse = (response, expectedStatus = 200) => {
  expect(response.status).toBe(expectedStatus)
  expect(response.json).toBeDefined()
}

export const expectErrorResponse = (response, expectedStatus, expectedMessage = null) => {
  expect(response.status).toBe(expectedStatus)
  expect(response.json).toBeDefined()
  
  if (expectedMessage) {
    expect(response.json.error).toContain(expectedMessage)
  }
}
