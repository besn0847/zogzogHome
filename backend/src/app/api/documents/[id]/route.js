import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/database.js'
import { authenticateUser } from '../../../../lib/auth.js'
import Document from '../../../../models/Document.js'
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Find document
    const document = await Document.findById(params.id)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('collection', 'name color')

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Check permissions
    const hasAccess = document.uploadedBy._id.toString() === user._id.toString() ||
                     document.isPublic ||
                     document.sharedWith.some(share => share.user.toString() === user._id.toString())

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Read markdown content if available
    let markdownContent = ''
    if (document.markdownPath && fs.existsSync(document.markdownPath)) {
      markdownContent = fs.readFileSync(document.markdownPath, 'utf-8')
    }

    return NextResponse.json({
      document: document.toObject(),
      markdownContent
    })

  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Find document
    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Check permissions (only owner or admin can delete)
    const canDelete = document.uploadedBy.toString() === user._id.toString() || 
                     user.role === 'admin'

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Delete files from filesystem
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath)
    }
    if (document.markdownPath && fs.existsSync(document.markdownPath)) {
      fs.unlinkSync(document.markdownPath)
    }

    // Delete from database
    await Document.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Document supprimé avec succès'
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const updates = await request.json()

    // Find document
    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Check permissions
    const canEdit = document.uploadedBy.toString() === user._id.toString() || 
                   user.role === 'admin'

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'tags', 'collection', 'isPublic']
    const updateData = {}
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    })

    // Update document
    const updatedDocument = await Document.findByIdAndUpdate(
      params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('uploadedBy', 'firstName lastName email')
     .populate('collection', 'name color')

    return NextResponse.json({
      document: updatedDocument.toObject(),
      message: 'Document mis à jour avec succès'
    })

  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
