import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/database.js'
import { authenticateUser } from '../../../../lib/auth.js'
import Document from '../../../../models/Document.js'
import ChatSession from '../../../../models/ChatSession.js'

export async function POST(request, { params }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Connect to database
    await connectMongoDB()

    // Parse request body
    const { message, documentId } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

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

    // Find or create chat session
    let chatSession = await ChatSession.findOne({
      documentId: params.id,
      userId: user._id
    })

    if (!chatSession) {
      chatSession = new ChatSession({
        documentId: params.id,
        userId: user._id,
        messages: []
      })
    }

    // Add user message to session
    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }
    chatSession.messages.push(userMessage)

    // TODO: Integrate with LLM service for AI response
    // For now, return a placeholder response
    const aiResponse = {
      role: 'assistant',
      content: `Merci pour votre question sur "${document.title}". Cette fonctionnalité de chat IA sera bientôt disponible avec l'intégration complète des services LLM.`,
      timestamp: new Date(),
      sources: []
    }
    chatSession.messages.push(aiResponse)

    // Save chat session
    await chatSession.save()

    return NextResponse.json({
      response: aiResponse.content,
      sources: aiResponse.sources,
      messageId: aiResponse._id
    })

  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
