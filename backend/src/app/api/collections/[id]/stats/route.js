import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../lib/database.js'
import { authenticateUser } from '../../../../../lib/auth.js'
import Collection from '../../../../../models/Collection.js'
import Document from '../../../../../models/Document.js'
import ChatSession from '../../../../../models/ChatSession.js'

// GET /api/collections/[id]/stats - Récupérer les statistiques détaillées d'une collection
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Find collection
    const collection = await Collection.findById(id)

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    }

    // Check if user has access to this collection
    if (!collection.hasAccess(user._id)) {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette collection' },
        { status: 403 }
      )
    }

    // Get document statistics
    const documentStats = await Document.aggregate([
      {
        $match: {
          collection: collection._id,
          $or: [
            { uploadedBy: user._id },
            { isPublic: true },
            { 'sharedWith.user': user._id }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          avgSize: { $avg: '$fileSize' },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ])

    // Process status counts
    const statusCounts = {
      pending: 0,
      processing: 0,
      completed: 0,
      error: 0
    }

    if (documentStats.length > 0) {
      documentStats[0].statusCounts.forEach(status => {
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++
        }
      })
    }

    // Get documents by upload date (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const documentsOverTime = await Document.aggregate([
      {
        $match: {
          collection: collection._id,
          createdAt: { $gte: thirtyDaysAgo },
          $or: [
            { uploadedBy: user._id },
            { isPublic: true },
            { 'sharedWith.user': user._id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Get top contributors
    const topContributors = await Document.aggregate([
      {
        $match: {
          collection: collection._id,
          $or: [
            { uploadedBy: user._id },
            { isPublic: true },
            { 'sharedWith.user': user._id }
          ]
        }
      },
      {
        $group: {
          _id: '$uploadedBy',
          documentCount: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email'
          },
          documentCount: 1,
          totalSize: 1
        }
      },
      {
        $sort: { documentCount: -1 }
      },
      {
        $limit: 5
      }
    ])

    // Get chat sessions count for this collection
    const chatSessionsCount = await ChatSession.countDocuments({
      'context.collections': collection._id
    })

    // Get recent activity (last 10 documents)
    const recentActivity = await Document.find({
      collection: collection._id,
      $or: [
        { uploadedBy: user._id },
        { isPublic: true },
        { 'sharedWith.user': user._id }
      ]
    })
    .populate('uploadedBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title filename status createdAt uploadedBy')

    // Calculate storage usage percentage (assuming a limit)
    const STORAGE_LIMIT = 1024 * 1024 * 1024 * 5 // 5GB limit per collection
    const totalSize = documentStats.length > 0 ? documentStats[0].totalSize : 0
    const storageUsagePercent = Math.round((totalSize / STORAGE_LIMIT) * 100)

    // Prepare response
    const stats = {
      overview: {
        totalDocuments: documentStats.length > 0 ? documentStats[0].totalDocuments : 0,
        totalSize,
        avgSize: documentStats.length > 0 ? Math.round(documentStats[0].avgSize) : 0,
        totalMembers: collection.members.length + 1, // +1 for owner
        chatSessions: chatSessionsCount,
        storageUsagePercent: Math.min(storageUsagePercent, 100)
      },
      statusDistribution: statusCounts,
      documentsOverTime,
      topContributors,
      recentActivity,
      collectionInfo: {
        createdAt: collection.createdAt,
        isPublic: collection.isPublic,
        settings: collection.settings
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Error fetching collection stats:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
