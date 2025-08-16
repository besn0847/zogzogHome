import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { NextResponse } from 'next/server'
import { GET, PUT, DELETE } from '../src/app/api/collections/[id]/route.js'
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

// Mock NextResponse
const mockNextResponse = {
  json: jest.fn((data, options = {}) => ({
    json: data,
    status: options.status || 200
  }))
}

jest.mock('next/server', () => ({
  NextResponse: mockNextResponse
}))

// Mock database connection
jest.mock('../src/lib/database.js', () => ({
  connectMongoDB: jest.fn()
}))

// Mock authentication
jest.mock('../src/lib/auth.js', () => ({
  authenticateUser: jest.fn()
}))

describe('Collections CRUD API', () => {
  let testUser, otherUser, testCollection, authToken, otherAuthToken

  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
    
    // Create test users
    testUser = await createTestUser({
      email: 'owner@example.com',
      firstName: 'Owner',
      lastName: 'User'
    })
    
    otherUser = await createTestUser({
      email: 'other@example.com',
      firstName: 'Other',
      lastName: 'User'
    })

    // Create test collection
    testCollection = await createTestCollection(testUser._id, {
      name: 'Test Collection',
      description: 'A test collection for CRUD operations'
    })

    // Generate auth tokens
    authToken = generateTestToken(testUser._id)
    otherAuthToken = generateTestToken(otherUser._id)

    // Reset NextResponse mock
    NextResponse.json.mockClear()
  })

  describe('GET /api/collections/[id]', () => {
    test('should return collection details for owner', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(authToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        collection: expect.objectContaining({
          _id: testCollection._id,
          name: 'Test Collection',
          description: 'A test collection for CRUD operations',
          documentCount: 0,
          recentDocuments: []
        })
      })
      expect(response.status).toBe(200)
    })

    test('should return collection details with documents for owner', async () => {
      // Create test documents
      await createTestDocument(testUser._id, testCollection._id, { title: 'Doc 1' })
      await createTestDocument(testUser._id, testCollection._id, { title: 'Doc 2' })

      const request = createMockRequest({
        headers: createAuthHeader(authToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        collection: expect.objectContaining({
          documentCount: 2,
          recentDocuments: expect.arrayContaining([
            expect.objectContaining({ title: 'Doc 1' }),
            expect.objectContaining({ title: 'Doc 2' })
          ])
        })
      })
    })

    test('should return 404 for non-existent collection', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(authToken)
      })

      const response = await GET(request, { params: { id: '507f1f77bcf86cd799439011' } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    })

    test('should return 403 for unauthorized user', async () => {
      const request = createMockRequest({
        headers: createAuthHeader(otherAuthToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Accès non autorisé à cette collection' },
        { status: 403 }
      )
    })

    test('should allow access to public collection', async () => {
      // Make collection public
      testCollection.isPublic = true
      await testCollection.save()

      const request = createMockRequest({
        headers: createAuthHeader(otherAuthToken)
      })

      const response = await GET(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      expect(NextResponse.json).toHaveBeenCalledWith({
        collection: expect.objectContaining({
          name: 'Test Collection',
          isPublic: true
        })
      })
    })
  })

  describe('PUT /api/collections/[id]', () => {
    test('should update collection successfully for owner', async () => {
      const updateData = {
        name: 'Updated Collection',
        description: 'Updated description',
        color: '#FF5733',
        isPublic: true
      }

      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(authToken),
        body: updateData
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        collection: expect.objectContaining({
          name: 'Updated Collection',
          description: 'Updated description',
          color: '#FF5733',
          isPublic: true
        }),
        message: 'Collection mise à jour avec succès'
      })
      expect(response.status).toBe(200)
    })

    test('should return 400 for empty name', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(authToken),
        body: { name: '' }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Le nom de la collection est requis' },
        { status: 400 }
      )
    })

    test('should return 400 for duplicate name', async () => {
      // Create another collection with different name
      await createTestCollection(testUser._id, { name: 'Another Collection' })

      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(authToken),
        body: { name: 'Another Collection' }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Une collection avec ce nom existe déjà' },
        { status: 400 }
      )
    })

    test('should return 403 for unauthorized user', async () => {
      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(otherAuthToken),
        body: { name: 'Hacked Collection' }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Permissions insuffisantes pour modifier cette collection' },
        { status: 403 }
      )
    })

    test('should allow editor to update collection', async () => {
      // Add other user as editor
      testCollection.members.push({
        user: otherUser._id,
        role: 'editor'
      })
      await testCollection.save()

      const request = createMockRequest({
        method: 'PUT',
        headers: createAuthHeader(otherAuthToken),
        body: { description: 'Updated by editor' }
      })

      const response = await PUT(request, { params: { id: testCollection._id.toString() } })

      expect(response.status).toBe(200)
      expect(NextResponse.json).toHaveBeenCalledWith({
        collection: expect.objectContaining({
          description: 'Updated by editor'
        }),
        message: 'Collection mise à jour avec succès'
      })
    })
  })

  describe('DELETE /api/collections/[id]', () => {
    test('should delete empty collection successfully for owner', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(authToken)
      })

      const response = await DELETE(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith({
        message: 'Collection supprimée avec succès'
      })
      expect(response.status).toBe(200)
    })

    test('should return 400 when trying to delete collection with documents', async () => {
      // Add a document to the collection
      await createTestDocument(testUser._id, testCollection._id)

      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(authToken)
      })

      const response = await DELETE(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: expect.stringContaining('Impossible de supprimer la collection car elle contient') },
        { status: 400 }
      )
    })

    test('should return 403 for non-owner', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(otherAuthToken)
      })

      const response = await DELETE(request, { params: { id: testCollection._id.toString() } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Seul le propriétaire peut supprimer cette collection' },
        { status: 403 }
      )
    })

    test('should return 404 for non-existent collection', async () => {
      const request = createMockRequest({
        method: 'DELETE',
        headers: createAuthHeader(authToken)
      })

      const response = await DELETE(request, { params: { id: '507f1f77bcf86cd799439011' } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    })
  })
})
