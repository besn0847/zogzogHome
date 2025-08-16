import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../../lib/database.js'
import { authenticateUser } from '../../../../../../lib/auth.js'
import Collection from '../../../../../../models/Collection.js'
import User from '../../../../../../models/User.js'

// PUT /api/collections/[id]/members/[userId] - Modifier le rôle d'un membre
export async function PUT(request, { params }) {
  try {
    const { id, userId } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { role } = await request.json()

    // Validate role
    if (!['viewer', 'editor'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide. Utilisez "viewer" ou "editor"' },
        { status: 400 }
      )
    }

    // Find collection
    const collection = await Collection.findById(id)

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection non trouvée' },
        { status: 404 }
      )
    }

    // Check if user has editor access (only editors and owners can modify roles)
    if (!collection.hasAccess(user._id, 'editor')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour modifier les rôles' },
        { status: 403 }
      )
    }

    // Check if trying to modify owner
    if (collection.createdBy.toString() === userId) {
      return NextResponse.json(
        { error: 'Impossible de modifier le rôle du propriétaire' },
        { status: 400 }
      )
    }

    // Find member in collection
    const memberIndex = collection.members.findIndex(
      member => member.user.toString() === userId
    )

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Membre non trouvé dans cette collection' },
        { status: 404 }
      )
    }

    // Update member role
    collection.members[memberIndex].role = role
    collection.updatedAt = new Date()

    await collection.save()

    // Get updated member info
    const updatedCollection = await Collection.findById(id)
      .populate('members.user', 'firstName lastName email')

    const updatedMember = updatedCollection.members.find(
      member => member.user._id.toString() === userId
    )

    return NextResponse.json({
      member: updatedMember,
      message: `Rôle mis à jour vers ${role}`
    })

  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id]/members/[userId] - Retirer un membre d'une collection
export async function DELETE(request, { params }) {
  try {
    const { id, userId } = params
    
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

    // Check permissions: owner can remove anyone, members can remove themselves
    const isOwner = collection.createdBy.toString() === user._id.toString()
    const isSelf = userId === user._id.toString()

    if (!isOwner && !isSelf) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour retirer ce membre' },
        { status: 403 }
      )
    }

    // Check if trying to remove owner
    if (collection.createdBy.toString() === userId) {
      return NextResponse.json(
        { error: 'Impossible de retirer le propriétaire de la collection' },
        { status: 400 }
      )
    }

    // Find member in collection
    const memberIndex = collection.members.findIndex(
      member => member.user.toString() === userId
    )

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Membre non trouvé dans cette collection' },
        { status: 404 }
      )
    }

    // Get member info before removal
    const memberToRemove = await User.findById(userId).select('firstName lastName email')

    // Remove member
    collection.members.splice(memberIndex, 1)
    collection.updatedAt = new Date()

    await collection.save()

    return NextResponse.json({
      message: `${memberToRemove.firstName} ${memberToRemove.lastName} retiré de la collection`
    })

  } catch (error) {
    console.error('Error removing collection member:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
