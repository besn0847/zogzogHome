import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  }
}))

// Mock environment variables
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3001'

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Mock fetch globally
global.fetch = jest.fn()

// Mock file operations
Object.defineProperty(window, 'File', {
  value: class MockFile {
    constructor(parts, filename, properties) {
      this.parts = parts
      this.name = filename
      this.size = properties?.size || 0
      this.type = properties?.type || ''
    }
  }
})

Object.defineProperty(window, 'FileReader', {
  value: class MockFileReader {
    readAsDataURL = jest.fn()
    readAsText = jest.fn()
    result = null
    onload = null
    onerror = null
  }
})
