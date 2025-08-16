import { describe, test, expect, beforeAll, afterAll, beforeEach, fail } from '@jest/globals'
import {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestCollection,
  createTestDocument
} from './setup.js'

describe('Collections Models and Database Tests', () => {
  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
  })

  describe('Collection Model', () => {
    test('should create a collection successfully', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id, {
        name: 'Test Collection',
        description: 'A test collection'
      })

      expect(collection).toBeDefined()
      expect(collection.name).toBe('Test Collection')
      expect(collection.description).toBe('A test collection')
      expect(collection.createdBy.toString()).toBe(user._id.toString())
    })

    test('should validate required fields', async () => {
      const user = await createTestUser()
      const Collection = (await import('../src/models/Collection.js')).default
      
      try {
        // Create collection directly without helper to test validation
        const collection = new Collection({
          description: 'No name',
          createdBy: user._id
          // Missing required 'name' field
        })
        await collection.save()
        // If we reach here, the test should fail
        expect(true).toBe(false) // Force failure
      } catch (error) {
        expect(error.message).toContain('name')
      }
    })

    test('should have default values', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id, {
        name: 'Test Collection'
      })

      expect(collection.isPublic).toBe(false)
      expect(collection.color).toBe('#3B82F6')
      expect(collection.icon).toBe('folder')
      expect(collection.members).toEqual([])
    })
  })

  describe('Collection Access Control', () => {
    test('should check owner access correctly', async () => {
      const owner = await createTestUser()
      const other = await createTestUser({ email: 'other@example.com' })
      const collection = await createTestCollection(owner._id)

      expect(collection.hasAccess(owner._id)).toBe(true)
      expect(collection.hasAccess(other._id)).toBe(false)
    })

    test('should check public collection access', async () => {
      const owner = await createTestUser()
      const other = await createTestUser({ email: 'other@example.com' })
      const collection = await createTestCollection(owner._id, {
        name: 'Public Collection',
        isPublic: true
      })

      expect(collection.hasAccess(owner._id)).toBe(true)
      expect(collection.hasAccess(other._id, 'viewer')).toBe(true)
      expect(collection.hasAccess(other._id, 'editor')).toBe(false)
    })

    test('should check member access with roles', async () => {
      const owner = await createTestUser()
      const editor = await createTestUser({ email: 'editor@example.com' })
      const viewer = await createTestUser({ email: 'viewer@example.com' })
      
      const collection = await createTestCollection(owner._id, {
        name: 'Test Collection',
        members: [
          { user: editor._id, role: 'editor' },
          { user: viewer._id, role: 'viewer' }
        ]
      })

      expect(collection.hasAccess(editor._id, 'viewer')).toBe(true)
      expect(collection.hasAccess(editor._id, 'editor')).toBe(true)
      expect(collection.hasAccess(viewer._id, 'viewer')).toBe(true)
      expect(collection.hasAccess(viewer._id, 'editor')).toBe(false)
    })
  })

  describe('Collection with Documents', () => {
    test('should create documents in collection', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id)
      
      const doc1 = await createTestDocument(user._id, collection._id, {
        title: 'Document 1'
      })
      
      const doc2 = await createTestDocument(user._id, collection._id, {
        title: 'Document 2'
      })

      expect(doc1.collection.toString()).toBe(collection._id.toString())
      expect(doc2.collection.toString()).toBe(collection._id.toString())
    })

    test('should handle different document statuses', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id)
      
      const statuses = ['pending', 'processing', 'completed', 'failed']
      
      for (const status of statuses) {
        const doc = await createTestDocument(user._id, collection._id, {
          title: `Document ${status}`,
          processingStatus: status
        })
        expect(doc.processingStatus).toBe(status)
      }
    })
  })

  describe('Collection Settings and Sharing', () => {
    test('should handle collection settings', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id, {
        name: 'Settings Test',
        settings: {
          allowPublicDocuments: true,
          requireApproval: true,
          autoTagging: false
        }
      })

      expect(collection.settings.allowPublicDocuments).toBe(true)
      expect(collection.settings.requireApproval).toBe(true)
      expect(collection.settings.autoTagging).toBe(false)
    })

    test('should handle share tokens', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id, {
        name: 'Share Test',
        shareToken: 'test-token-123'
      })

      expect(collection.shareToken).toBe('test-token-123')
    })

    test('should handle share token expiration', async () => {
      const user = await createTestUser()
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h from now
      
      const collection = await createTestCollection(user._id, {
        name: 'Expiration Test',
        shareToken: 'expiring-token',
        shareTokenExpiresAt: expirationDate
      })

      expect(collection.shareTokenExpiresAt).toEqual(expirationDate)
    })
  })

  describe('Collection Statistics', () => {
    test('should track collection stats', async () => {
      const user = await createTestUser()
      const collection = await createTestCollection(user._id, {
        name: 'Stats Test',
        stats: {
          documentCount: 5,
          totalSize: 1024 * 1024, // 1MB
          lastActivity: new Date()
        }
      })

      expect(collection.stats.documentCount).toBe(5)
      expect(collection.stats.totalSize).toBe(1024 * 1024)
      expect(collection.stats.lastActivity).toBeInstanceOf(Date)
    })
  })

  describe('Collection Members Management', () => {
    test('should add and manage members', async () => {
      const owner = await createTestUser()
      const member1 = await createTestUser({ email: 'member1@example.com' })
      const member2 = await createTestUser({ email: 'member2@example.com' })
      
      const collection = await createTestCollection(owner._id, {
        name: 'Members Test'
      })

      // Add members
      collection.members.push(
        { user: member1._id, role: 'editor' },
        { user: member2._id, role: 'viewer' }
      )
      
      await collection.save()

      expect(collection.members).toHaveLength(2)
      expect(collection.members[0].role).toBe('editor')
      expect(collection.members[1].role).toBe('viewer')
    })

    test('should handle member timestamps', async () => {
      const owner = await createTestUser()
      const member = await createTestUser({ email: 'member@example.com' })
      
      const collection = await createTestCollection(owner._id, {
        name: 'Timestamp Test'
      })

      const addedAt = new Date()
      collection.members.push({
        user: member._id,
        role: 'viewer',
        addedAt
      })
      
      await collection.save()

      expect(collection.members[0].addedAt).toEqual(addedAt)
    })
  })
})
