import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../../lib/database.js'
import { authenticateUser } from '../../../../../lib/auth.js'
import Document from '../../../../../models/Document.js'
import fs from 'fs'

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

    // Check if file exists
    if (!document.filePath || !fs.existsSync(document.filePath)) {
      return NextResponse.json(
        { error: 'Fichier non trouvé sur le serveur' },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = fs.readFileSync(document.filePath)
    
    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': fileBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error downloading document:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
