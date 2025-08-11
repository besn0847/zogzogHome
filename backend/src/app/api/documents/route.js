import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../lib/database.js'
import { authenticateUser } from '../../../lib/auth.js'
import Document from '../../../models/Document.js'

export async function GET(request) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const collection = searchParams.get('collection')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query
    const query = {
      $or: [
        { uploadedBy: user._id },
        { isPublic: true },
        { 'sharedWith.user': user._id }
      ]
    }

    if (collection) {
      query.collection = collection
    }

    if (status) {
      query.processingStatus = status
    }

    if (search) {
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { 'metadata.author': { $regex: search, $options: 'i' } },
          { 'metadata.subject': { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      })
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const documents = await Document.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('collection', 'name color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const total = await Document.countDocuments(query)

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur de récupération des documents:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
