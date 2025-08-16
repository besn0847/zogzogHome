import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../lib/database.js'
import { authenticateUser } from '../../../../../lib/auth.js'
import Collection from '../../../../../models/Collection.js'
import crypto from 'crypto'

// GET /api/collections/[id]/share - Récupérer les informations de partage
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

    // Check if user has editor access (only editors and owners can manage sharing)
    if (!collection.hasAccess(user._id, 'editor')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour gérer le partage' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      shareInfo: {
        isPublic: collection.isPublic,
        shareToken: collection.shareToken || null,
        shareUrl: collection.shareToken ? 
          `${process.env.NEXT_PUBLIC_APP_URL}/collections/shared/${collection.shareToken}` : 
          null,
        totalMembers: collection.members.length + 1, // +1 for owner
        settings: collection.settings
      }
    })

  } catch (error) {
    console.error('Error fetching share info:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/collections/[id]/share - Générer ou régénérer un lien de partage
export async function POST(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { action = 'generate', expiresIn } = await request.json()

    // Find collection
    const collection = await Collection.findById(id)

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    }

    // Check if user has editor access
    if (!collection.hasAccess(user._id, 'editor')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour gérer le partage' },
        { status: 403 }
      )
    }

    let shareToken = collection.shareToken
    let shareUrl = null

    if (action === 'generate' || action === 'regenerate') {
      // Generate new share token
      shareToken = crypto.randomBytes(32).toString('hex')
      
      // Calculate expiration date if provided
      let expiresAt = null
      if (expiresIn) {
        expiresAt = new Date()
        switch (expiresIn) {
          case '1h':
            expiresAt.setHours(expiresAt.getHours() + 1)
            break
          case '24h':
            expiresAt.setHours(expiresAt.getHours() + 24)
            break
          case '7d':
            expiresAt.setDate(expiresAt.getDate() + 7)
            break
          case '30d':
            expiresAt.setDate(expiresAt.getDate() + 30)
            break
          default:
            expiresAt = null // No expiration
        }
      }

      // Update collection
      await Collection.findByIdAndUpdate(id, {
        shareToken,
        shareTokenExpiresAt: expiresAt,
        updatedAt: new Date()
      })

      shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/collections/shared/${shareToken}`

      return NextResponse.json({
        shareToken,
        shareUrl,
        expiresAt,
        message: action === 'generate' ? 
          'Lien de partage généré avec succès' : 
          'Lien de partage régénéré avec succès'
      })

    } else if (action === 'revoke') {
      // Revoke share token
      await Collection.findByIdAndUpdate(id, {
        $unset: {
          shareToken: 1,
          shareTokenExpiresAt: 1
        },
        updatedAt: new Date()
      })

      return NextResponse.json({
        message: 'Lien de partage révoqué avec succès'
      })

    } else {
      return NextResponse.json(
        { error: 'Action invalide. Utilisez "generate", "regenerate" ou "revoke"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error managing share link:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[id]/share - Modifier les paramètres de partage
export async function PUT(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { isPublic, settings } = await request.json()

    // Find collection
    const collection = await Collection.findById(id)

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    }

    // Check if user has editor access
    if (!collection.hasAccess(user._id, 'editor')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour modifier les paramètres de partage' },
        { status: 403 }
      )
    }

    // Update sharing settings
    const updateData = { updatedAt: new Date() }
    
    if (isPublic !== undefined) {
      updateData.isPublic = isPublic
    }
    
    if (settings) {
      updateData.settings = { ...collection.settings, ...settings }
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    return NextResponse.json({
      shareInfo: {
        isPublic: updatedCollection.isPublic,
        shareToken: updatedCollection.shareToken || null,
        shareUrl: updatedCollection.shareToken ? 
          `${process.env.NEXT_PUBLIC_APP_URL}/collections/shared/${updatedCollection.shareToken}` : 
          null,
        settings: updatedCollection.settings
      },
      message: 'Paramètres de partage mis à jour avec succès'
    })

  } catch (error) {
    console.error('Error updating share settings:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
