import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/database.js'
import { authenticateUser } from '../../../../lib/auth.js'
import Collection from '../../../../models/Collection.js'
import Document from '../../../../models/Document.js'

// GET /api/collections/[id] - Récupérer une collection spécifique
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Find collection with access check
    const collection = await Collection.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email')

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

    // Get document count for this collection
    const documentCount = await Document.countDocuments({
      collection: collection._id,
      $or: [
        { uploadedBy: user._id },
        { isPublic: true },
        { 'sharedWith.user': user._id }
      ]
    })

    // Get recent documents in this collection
    const recentDocuments = await Document.find({
      collection: collection._id,
      $or: [
        { uploadedBy: user._id },
        { isPublic: true },
        { 'sharedWith.user': user._id }
      ]
    })
    .populate('uploadedBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title filename status createdAt uploadedBy')

    return NextResponse.json({
      collection: {
        ...collection.toObject(),
        documentCount,
        recentDocuments
      }
    })

  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[id] - Modifier une collection
export async function PUT(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { name, description, color, icon, isPublic, settings } = await request.json()

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
        { error: 'Permissions insuffisantes pour modifier cette collection' },
        { status: 403 }
      )
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Le nom de la collection est requis' },
          { status: 400 }
        )
      }

      // Check if another collection with same name exists for this user
      const existingCollection = await Collection.findOne({
        name: name.trim(),
        createdBy: user._id,
        _id: { $ne: id }
      })

      if (existingCollection) {
        return NextResponse.json(
          { error: 'Une collection avec ce nom existe déjà' },
          { status: 400 }
        )
      }
    }

    // Update fields
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (settings !== undefined) updateData.settings = { ...collection.settings, ...settings }
    
    updateData.updatedAt = new Date()

    // Update collection
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'firstName lastName email')
    .populate('members.user', 'firstName lastName email')

    return NextResponse.json({
      collection: updatedCollection.toObject(),
      message: 'Collection mise à jour avec succès'
    })

  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id] - Supprimer une collection
export async function DELETE(request, { params }) {
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

    // Only owner can delete collection
    if (collection.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Seul le propriétaire peut supprimer cette collection' },
        { status: 403 }
      )
    }

    // Check if collection has documents
    const documentCount = await Document.countDocuments({ collection: id })
    
    if (documentCount > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer la collection car elle contient ${documentCount} document(s). Veuillez d'abord déplacer ou supprimer les documents.` },
        { status: 400 }
      )
    }

    // Delete collection
    await Collection.findByIdAndDelete(id)

    return NextResponse.json({
      message: 'Collection supprimée avec succès'
    })

  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
