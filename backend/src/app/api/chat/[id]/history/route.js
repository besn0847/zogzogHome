import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../lib/database.js'
import { authenticateUser } from '../../../../../lib/auth.js'
import Document from '../../../../../models/Document.js'
import ChatSession from '../../../../../models/ChatSession.js'

export async function GET(request, { params }) {
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

    // Check permissions
    const hasAccess = document.uploadedBy.toString() === user._id.toString() ||
                     document.isPublic ||
                     document.sharedWith.some(share => share.user.toString() === user._id.toString())

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Find chat session
    const chatSession = await ChatSession.findOne({
      documentId: params.id,
      userId: user._id
    })

    const messages = chatSession ? chatSession.messages : []

    return NextResponse.json({
      messages: messages.map(msg => ({
        id: msg._id,
        type: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        sources: msg.sources || []
      }))
    })

  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
