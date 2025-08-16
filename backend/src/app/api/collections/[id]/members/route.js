import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../lib/database.js'
import { authenticateUser } from '../../../../../lib/auth.js'
import Collection from '../../../../../models/Collection.js'
import User from '../../../../../models/User.js'

// GET /api/collections/[id]/members - Récupérer les membres d'une collection
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Find collection
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

    // Prepare members list including owner
    const members = [
      {
        user: collection.createdBy,
        role: 'owner',
        addedAt: collection.createdAt,
        isOwner: true
      },
      ...collection.members.map(member => ({
        ...member.toObject(),
        isOwner: false
      }))
    ]

    return NextResponse.json({
      members,
      totalMembers: members.length
    })

  } catch (error) {
    console.error('Error fetching collection members:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/collections/[id]/members - Ajouter un membre à une collection
export async function POST(request, { params }) {
  try {
    const { id } = params
    
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { email, role = 'viewer' } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

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

    // Check if user has editor access (only editors and owners can add members)
    if (!collection.hasAccess(user._id, 'editor')) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour ajouter des membres' },
        { status: 403 }
      )
    }

    // Find user to add
    const userToAdd = await User.findOne({ email: email.toLowerCase() })

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé avec cet email' },
        { status: 404 }
      )
    }

    // Check if user is already owner
    if (collection.createdBy.toString() === userToAdd._id.toString()) {
      return NextResponse.json(
        { error: 'Cet utilisateur est déjà propriétaire de la collection' },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingMember = collection.members.find(
      member => member.user.toString() === userToAdd._id.toString()
    )

    if (existingMember) {
      return NextResponse.json(
        { error: 'Cet utilisateur est déjà membre de la collection' },
        { status: 400 }
      )
    }

    // Add member
    collection.members.push({
      user: userToAdd._id,
      role,
      addedAt: new Date()
    })

    await collection.save()

    // Return updated collection with populated members
    const updatedCollection = await Collection.findById(id)
      .populate('members.user', 'firstName lastName email')

    const newMember = updatedCollection.members.find(
      member => member.user._id.toString() === userToAdd._id.toString()
    )

    return NextResponse.json({
      member: newMember,
      message: `${userToAdd.firstName} ${userToAdd.lastName} ajouté comme ${role}`
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding collection member:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
