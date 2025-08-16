import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { NextResponse } from 'next/server'
import { GET, POST, PUT } from '../src/app/api/collections/[id]/share/route.js'
import {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestCollection,
  generateTestToken,
  createAuthHeader,
  createMockRequest
} from './setup.js'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => ({
      json: data,
      status: options.status || 200
    }))
  }
}))

// Mock environment variable
process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'

describe('Collections Share API', () => {
  let owner, editor, viewer, outsider, testCollection
  let ownerToken, editorToken, viewerToken, outsiderToken

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
    
    viewer = await createTestUser({
      email: 'viewer@example.com',
      firstName: 'Viewer',
      lastName: 'User'
    })
    
    outsider = await createTestUser({
      email: 'outsider@example.com',
      firstName: 'Outsider',
      lastName: 'User'
    })

    // Create test collection with members
    testCollection = await createTestCollection(owner._id, {
      name: 'Test Collection',
      members: [
        { user: editor._id, role: 'editor' },
        { user: viewer._id, role: 'viewer' }
      ]
    })

    // Generate auth tokens
    ownerToken = generateTestToken(owner._id)
    editorToken = generateTestToken(editor._id)
    viewerToken = generateTestToken(viewer._id)
    outsiderToken = generateTestToken(outsider._id)

    // Reset NextResponse mock
    NextResponse.json.mockClear()
  })

  describe('GET /api/collections/[id]/share', () => {
    test('should return share info for owner', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        shareInfo: expect.objectContaining({
          isPublic: false,
          shareToken: null,
          shareUrl: null,
          totalMembers: 3, // owner + editor + viewer
          settings: expect.any(Object)
        })
      })
      expect(response.status).toBe(200)
    })

    test('should return share info for editor', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(editorToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      expect(NextResponse.json).toHaveBeenCalledWith({
        shareInfo: expect.objectContaining({
          isPublic: false,
          totalMembers: 3
        })
      })
    })

    test('should return share info with existing token', async () => {
      // Add share token to collection
      testCollection.shareToken = 'existing-token-123'
      await testCollection.save()

      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        shareInfo: expect.objectContaining({
          shareToken: 'existing-token-123',
          shareUrl: 'https://example.com/collections/shared/existing-token-123'
        })
      })
    })

    test('should return 403 for viewer', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(viewerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour gérer le partage' },
        { status: 403 }
      )
    })

    test('should return 403 for outsider', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(outsiderToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour gérer le partage' },
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
  })

  describe('POST /api/collections/[id]/share', () => {
    test('should generate new share token by owner', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { action: 'generate' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        shareToken: expect.any(String),
        shareUrl: expect.stringContaining('https://example.com/collections/shared/'),
        expiresAt: null,
        message: 'Lien de partage généré avec succès'
      })
      expect(response.status).toBe(200)
    })

    test('should generate share token with expiration', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { 
          action: 'generate',
          expiresIn: '24h'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      const responseData = NextResponse.json.mock.calls[0][0]
      expect(responseData.shareToken).toBeDefined()
      expect(responseData.expiresAt).toBeInstanceOf(Date)
      expect(responseData.message).toBe('Lien de partage généré avec succès')
    })

    test('should regenerate existing share token', async () => {
      // Add existing token
      testCollection.shareToken = 'old-token-123'
      await testCollection.save()

      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { action: 'regenerate' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      const responseData = NextResponse.json.mock.calls[0][0]
      expect(responseData.shareToken).not.toBe('old-token-123')
      expect(responseData.message).toBe('Lien de partage régénéré avec succès')
    })

    test('should revoke share token', async () => {
      // Add existing token
      testCollection.shareToken = 'token-to-revoke'
      await testCollection.save()

      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { action: 'revoke' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        message: 'Lien de partage révoqué avec succès'
      })
      expect(response.status).toBe(200)
    })

    test('should handle different expiration periods', async () => {
      const expirationTests = [
        { expiresIn: '1h', expectedHours: 1 },
        { expiresIn: '24h', expectedHours: 24 },
        { expiresIn: '7d', expectedDays: 7 },
        { expiresIn: '30d', expectedDays: 30 }
      ]

      for (const { expiresIn, expectedHours, expectedDays } of expirationTests) {
        NextResponse.json.mockClear()
        
        const request = createMockRequest({
          method: 'POST',
          headers: createAuthHeader(ownerToken),
          body: { 
            action: 'generate',
            expiresIn
          }
        })

        const response = await POST(request, { params: { id: testCollection._id.toString() } })

        expect(response.status).toBe(200)
        const responseData = NextResponse.json.mock.calls[0][0]
        expect(responseData.expiresAt).toBeInstanceOf(Date)

        // Verify expiration time is approximately correct
        const now = new Date()
        const expiresAt = new Date(responseData.expiresAt)
        const diffMs = expiresAt.getTime() - now.getTime()
        
        if (expectedHours) {
          const expectedMs = expectedHours * 60 * 60 * 1000
          expect(Math.abs(diffMs - expectedMs)).toBeLessThan(60000) // Within 1 minute
        } else if (expectedDays) {
          const expectedMs = expectedDays * 24 * 60 * 60 * 1000
          expect(Math.abs(diffMs - expectedMs)).toBeLessThan(60000) // Within 1 minute
        }
      }
    })

    test('should return 400 for invalid action', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { action: 'invalid' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Action invalide. Utilisez "generate", "regenerate" ou "revoke"' },
        { status: 400 }
      )
    })

    test('should allow editor to manage sharing', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(editorToken),
        body: { action: 'generate' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
    })

    test('should return 403 for viewer', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(viewerToken),
        body: { action: 'generate' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour gérer le partage' },
        { status: 403 }
      )
    })
  })

  describe('PUT /api/collections/[id]/share', () => {
    test('should update sharing settings by owner', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: {
          isPublic: true,
          settings: {
            allowPublicDocuments: true,
            requireApproval: false
          }
        }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        shareInfo: expect.objectContaining({
          isPublic: true,
          settings: expect.objectContaining({
            allowPublicDocuments: true,
            requireApproval: false
          })
        }),
        message: 'Paramètres de partage mis à jour avec succès'
      })
      expect(response.status).toBe(200)
    })

    test('should update only isPublic setting', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { isPublic: true }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      const responseData = NextResponse.json.mock.calls[0][0]
      expect(responseData.shareInfo.isPublic).toBe(true)
    })

    test('should update only settings', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: {
          settings: {
            autoTagging: false
          }
        }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      const responseData = NextResponse.json.mock.calls[0][0]
      expect(responseData.shareInfo.settings.autoTagging).toBe(false)
    })

    test('should preserve existing share token when updating settings', async () => {
      // Add existing token
      testCollection.shareToken = 'existing-token'
      await testCollection.save()

      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { isPublic: true }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      const responseData = NextResponse.json.mock.calls[0][0]
      expect(responseData.shareInfo.shareToken).toBe('existing-token')
      expect(responseData.shareInfo.shareUrl).toContain('existing-token')
    })

    test('should allow editor to update sharing settings', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(editorToken),
        body: { isPublic: true }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
    })

    test('should return 403 for viewer', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(viewerToken),
        body: { isPublic: true }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour modifier les paramètres de partage' },
        { status: 403 }
      )
    })

    test('should return 404 for non-existent collection', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { isPublic: true }
      })

      const response = await PUT(request, { params: { id: '507f1f77bcf86cd799439011' } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    })
  })
})
