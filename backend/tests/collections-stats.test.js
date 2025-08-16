import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { NextResponse } from 'next/server'
import { GET } from '../src/app/api/collections/[id]/stats/route.js'
import {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestCollection,
  createTestDocument,
  generateTestToken,
  createAuthHeader,
  createMockRequest
} from './setup.js'
import ChatSession from '../src/models/ChatSession.js'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => ({
      json: data,
      status: options.status || 200
    }))
  }
}))

describe('Collections Stats API', () => {
  let owner, editor, outsider, testCollection
  let ownerToken, editorToken, outsiderToken

  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
    
    // Create test users
    owner = await createTestUser({
      email: 'owner@example.com',
      firstName: 'Owner',
      lastName: 'User'
    })
    
    editor = await createTestUser({
      email: 'editor@example.com',
      firstName: 'Editor',
      lastName: 'User'
    })
    
    outsider = await createTestUser({
      email: 'outsider@example.com',
      firstName: 'Outsider',
      lastName: 'User'
    })

    // Create test collection with editor
    testCollection = await createTestCollection(owner._id, {
      name: 'Test Collection',
      members: [
        { user: editor._id, role: 'editor' }
      ]
    })

    // Generate auth tokens
    ownerToken = generateTestToken(owner._id)
    editorToken = generateTestToken(editor._id)
    outsiderToken = generateTestToken(outsider._id)

    // Reset NextResponse mock
    NextResponse.json.mockClear()
  })

  describe('GET /api/collections/[id]/stats', () => {
    test('should return basic stats for empty collection', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        stats: expect.objectContaining({
          overview: expect.objectContaining({
            totalDocuments: 0,
            totalSize: 0,
            avgSize: 0,
            totalMembers: 2, // owner + editor
            chatSessions: 0,
            storageUsagePercent: 0
          }),
          statusDistribution: {
            pending: 0,
            processing: 0,
            completed: 0,
            error: 0
          },
          documentsOverTime: [],
          topContributors: [],
          recentActivity: [],
          collectionInfo: expect.objectContaining({
            createdAt: expect.any(Date),
            isPublic: false,
            settings: expect.any(Object)
          })
        })
      })
      expect(response.status).toBe(200)
    })

    test('should return comprehensive stats for collection with documents', async () => {
      // Create test documents with different statuses and contributors
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Doc 1',
        fileSize: 1024,
        status: 'completed'
      })
      
      await createTestDocument(editor._id, testCollection._id, {
        title: 'Doc 2',
        fileSize: 2048,
        status: 'processing'
      })
      
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Doc 3',
        fileSize: 512,
        status: 'completed'
      })
      
      await createTestDocument(editor._id, testCollection._id, {
        title: 'Doc 4',
        fileSize: 1536,
        status: 'error'
      })

      // Create a chat session
      const chatSession = new ChatSession({
        userId: owner._id,
        context: {
          collections: [testCollection._id]
        },
        messages: []
      })
      await chatSession.save()

      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        stats: expect.objectContaining({
          overview: expect.objectContaining({
            totalDocuments: 4,
            totalSize: 5120, // 1024 + 2048 + 512 + 1536
            avgSize: 1280, // 5120 / 4
            totalMembers: 2,
            chatSessions: 1,
            storageUsagePercent: expect.any(Number)
          }),
          statusDistribution: {
            pending: 0,
            processing: 1,
            completed: 2,
            error: 1
          },
          documentsOverTime: expect.any(Array),
          topContributors: expect.arrayContaining([
            expect.objectContaining({
              user: expect.objectContaining({
                email: 'owner@example.com'
              }),
              documentCount: 2,
              totalSize: 1536 // 1024 + 512
            }),
            expect.objectContaining({
              user: expect.objectContaining({
                email: 'editor@example.com'
              }),
              documentCount: 2,
              totalSize: 3584 // 2048 + 1536
            })
          ]),
          recentActivity: expect.arrayContaining([
            expect.objectContaining({ title: 'Doc 1' }),
            expect.objectContaining({ title: 'Doc 2' }),
            expect.objectContaining({ title: 'Doc 3' }),
            expect.objectContaining({ title: 'Doc 4' })
          ])
        })
      })
      expect(response.status).toBe(200)
    })

    test('should return stats for editor with access', async () => {
      // Create some documents
      await createTestDocument(owner._id, testCollection._id, { title: 'Doc 1' })
      await createTestDocument(editor._id, testCollection._id, { title: 'Doc 2' })

      const request = createMockRequest({
        headers: createAuthHeader(editorToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      expect(NextResponse.json).toHaveBeenCalledWith({
        stats: expect.objectContaining({
          overview: expect.objectContaining({
            totalDocuments: 2
          })
        })
      })
    })

    test('should return 403 for unauthorized user', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(outsiderToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Accès non autorisé à cette collection' },
        { status: 403 }
      )
    })

    test('should return 404 for non-existent collection', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: '507f1f77bcf86cd799439011' } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    })

    test('should handle documents over time aggregation', async () => {
      // Create documents with specific dates
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const twoDaysAgo = new Date(today)
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      await createTestDocument(owner._id, testCollection._id, {
        title: 'Today Doc',
        createdAt: today
      })
      
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Yesterday Doc 1',
        createdAt: yesterday
      })
      
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Yesterday Doc 2',
        createdAt: yesterday
      })
      
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Two Days Ago Doc',
        createdAt: twoDaysAgo
      })

      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      
      const stats = NextResponse.json.mock.calls[0][0].stats
      expect(stats.documentsOverTime).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ count: 1 }), // today
          expect.objectContaining({ count: 2 }), // yesterday
          expect.objectContaining({ count: 1 })  // two days ago
        ])
      )
    })

    test('should calculate storage usage percentage correctly', async () => {
      // Create a large document (1GB)
      const largeSize = 1024 * 1024 * 1024 // 1GB
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Large Doc',
        fileSize: largeSize
      })

      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      
      const stats = NextResponse.json.mock.calls[0][0].stats
      expect(stats.overview.storageUsagePercent).toBe(20) // 1GB out of 5GB limit = 20%
    })

    test('should limit storage usage percentage to 100%', async () => {
      // Create documents totaling more than 5GB
      const largeSize = 1024 * 1024 * 1024 * 6 // 6GB
      await createTestDocument(owner._id, testCollection._id, {
        title: 'Huge Doc',
        fileSize: largeSize
      })

      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      
      const stats = NextResponse.json.mock.calls[0][0].stats
      expect(stats.overview.storageUsagePercent).toBe(100) // Capped at 100%
    })
  })
})
