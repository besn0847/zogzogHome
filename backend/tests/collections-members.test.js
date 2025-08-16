import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { NextResponse } from 'next/server'
import { GET, POST } from '../src/app/api/collections/[id]/members/route.js'
import { PUT, DELETE } from '../src/app/api/collections/[id]/members/[userId]/route.js'
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

describe('Collections Members API', () => {
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

  describe('GET /api/collections/[id]/members', () => {
    test('should return all members including owner for owner', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(ownerToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        members: expect.arrayContaining([
          expect.objectContaining({
            user: expect.objectContaining({ email: 'owner@example.com' }),
            role: 'owner',
            isOwner: true
          }),
          expect.objectContaining({
            user: expect.objectContaining({ email: 'editor@example.com' }),
            role: 'editor',
            isOwner: false
          }),
          expect.objectContaining({
            user: expect.objectContaining({ email: 'viewer@example.com' }),
            role: 'viewer',
            isOwner: false
          })
        ]),
        totalMembers: 3
      })
      expect(response.status).toBe(200)
    })

    test('should return members for editor', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(editorToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      expect(NextResponse.json).toHaveBeenCalledWith({
        members: expect.arrayContaining([
          expect.objectContaining({ role: 'owner' }),
          expect.objectContaining({ role: 'editor' }),
          expect.objectContaining({ role: 'viewer' })
        ]),
        totalMembers: 3
      })
    })

    test('should return 403 for outsider', async () => {
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
  })

  describe('POST /api/collections/[id]/members', () => {
    test('should add new member successfully by owner', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: {
          email: 'outsider@example.com',
          role: 'viewer'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        member: expect.objectContaining({
          user: expect.objectContaining({ email: 'outsider@example.com' }),
          role: 'viewer'
        }),
        message: 'Outsider User ajouté comme viewer'
      }, { status: 201 })
    })

    test('should add new member successfully by editor', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(editorToken),
        body: {
          email: 'outsider@example.com',
          role: 'editor'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(201)
      expect(NextResponse.json).toHaveBeenCalledWith({
        member: expect.objectContaining({
          role: 'editor'
        }),
        message: 'Outsider User ajouté comme editor'
      }, { status: 201 })
    })

    test('should return 400 for missing email', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: { role: 'viewer' }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Email requis' },
        { status: 400 }
      )
    })

    test('should return 400 for invalid role', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: {
          email: 'outsider@example.com',
          role: 'admin'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Rôle invalide. Utilisez "viewer" ou "editor"' },
        { status: 400 }
      )
    })

    test('should return 404 for non-existent user', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: {
          email: 'nonexistent@example.com',
          role: 'viewer'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Utilisateur non trouvé avec cet email' },
        { status: 404 }
      )
    })

    test('should return 400 when trying to add owner as member', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: {
          email: 'owner@example.com',
          role: 'viewer'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Cet utilisateur est déjà propriétaire de la collection' },
        { status: 400 }
      )
    })

    test('should return 400 when trying to add existing member', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(ownerToken),
        body: {
          email: 'editor@example.com',
          role: 'viewer'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Cet utilisateur est déjà membre de la collection' },
        { status: 400 }
      )
    })

    test('should return 403 for viewer trying to add member', async () => {
      const request = createMockRequest({
        method: 'POST',
        headers: createAuthHeader(viewerToken),
        body: {
          email: 'outsider@example.com',
          role: 'viewer'
        }
      })

      const response = await POST(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour ajouter des membres' },
        { status: 403 }
      )
    })
  })

  describe('PUT /api/collections/[id]/members/[userId]', () => {
    test('should update member role successfully by owner', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { role: 'editor' }
      })

      const response = await PUT(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith({
        member: expect.objectContaining({
          role: 'editor'
        }),
        message: 'Rôle mis à jour vers editor'
      })
      expect(response.status).toBe(200)
    })

    test('should update member role successfully by editor', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(editorToken),
        body: { role: 'editor' }
      })

      const response = await PUT(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(response.status).toBe(200)
    })

    test('should return 400 for invalid role', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { role: 'admin' }
      })

      const response = await PUT(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Rôle invalide. Utilisez "viewer" ou "editor"' },
        { status: 400 }
      )
    })

    test('should return 400 when trying to modify owner role', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { role: 'viewer' }
      })

      const response = await PUT(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: owner._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Impossible de modifier le rôle du propriétaire' },
        { status: 400 }
      )
    })

    test('should return 404 for non-existent member', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(ownerToken),
        body: { role: 'editor' }
      })

      const response = await PUT(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: outsider._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Membre non trouvé dans cette collection' },
        { status: 404 }
      )
    })
  })

  describe('DELETE /api/collections/[id]/members/[userId]', () => {
    test('should remove member successfully by owner', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(ownerToken)
      })

      const response = await DELETE(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith({
        message: 'Viewer User retiré de la collection'
      })
      expect(response.status).toBe(200)
    })

    test('should allow member to remove themselves', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(viewerToken)
      })

      const response = await DELETE(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(response.status).toBe(200)
    })

    test('should return 400 when trying to remove owner', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(ownerToken)
      })

      const response = await DELETE(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: owner._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Impossible de retirer le propriétaire de la collection' },
        { status: 400 }
      )
    })

    test('should return 403 when non-owner tries to remove other member', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(editorToken)
      })

      const response = await DELETE(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: viewer._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour retirer ce membre' },
        { status: 403 }
      )
    })

    test('should return 404 for non-existent member', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(ownerToken)
      })

      const response = await DELETE(request, { 
        params: { 
          id: testCollection._id.toString(),
          userId: outsider._id.toString()
        } 
      })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Membre non trouvé dans cette collection' },
        { status: 404 }
      )
    })
  })
})
