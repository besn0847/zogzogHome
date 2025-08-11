import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../lib/database.js'
import { authenticateUser } from '../../../lib/auth.js'
import Collection from '../../../models/Collection.js'
import Document from '../../../models/Document.js'

export async function GET(request) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Get collections accessible to user
    const collections = await Collection.find({
      $or: [
        { createdBy: user._id },
        { isPublic: true },
        { 'sharedWith.user': user._id }
      ]
    })
    .populate('createdBy', 'firstName lastName email')
    .sort({ createdAt: -1 })

    // Add document count for each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const documentCount = await Document.countDocuments({
          collection: collection._id,
          $or: [
            { uploadedBy: user._id },
            { isPublic: true },
            { 'sharedWith.user': user._id }
          ]
        })
        
        return {
          ...collection.toObject(),
          documentCount
        }
      })
    )

    return NextResponse.json({
      collections: collectionsWithCount
    })

  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { name, description, color, isPublic } = await request.json()

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom de la collection est requis' },
        { status: 400 }
      )
    }

    // Check if collection with same name exists for this user
    const existingCollection = await Collection.findOne({
      name: name.trim(),
      createdBy: user._id
    })

    if (existingCollection) {
      return NextResponse.json(
        { error: 'Une collection avec ce nom existe déjà' },
        { status: 400 }
      )
    }

    // Create new collection
    const collection = new Collection({
      name: name.trim(),
      description: description || '',
      color: color || '#3B82F6',
      isPublic: isPublic || false,
      createdBy: user._id,
      sharedWith: [],
      tags: []
    })

    await collection.save()

    return NextResponse.json({
      collection: collection.toObject(),
      message: 'Collection créée avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
