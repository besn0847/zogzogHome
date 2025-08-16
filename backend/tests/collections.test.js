// Main test suite for Collections API
// This file imports and runs all collection-related tests

import { describe } from '@jest/globals'

// Import all test suites
import './collections-crud.test.js'
import './collections-members.test.js'
import './collections-stats.test.js'
import './collections-share.test.js'

describe('Collections API Test Suite', () => {
  // All tests are imported and will run automatically
  // This file serves as an entry point and organizer
})
