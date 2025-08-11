// Jest setup file
import { jest } from '@jest/globals'

// Mock environment variables for tests
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.MONGODB_URI = 'mongodb://localhost:27017/docpdf-test'
process.env.QDRANT_URL = 'http://localhost:6333'
process.env.REDIS_URL = 'redis://localhost:6379'

// Global test timeout
jest.setTimeout(30000)

// Mock external services for tests
jest.mock('axios')
jest.mock('ioredis')
