import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { connectMongoDB } from '../../../../lib/database.js'
import { authenticateUser } from '../../../../lib/auth.js'
import Document from '../../../../models/Document.js'

export async function POST(request) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file')
    const collectionId = formData.get('collectionId')
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : []

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Seuls les fichiers PDF sont acceptés' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 50MB)' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectMongoDB()

    // Create storage directory if it doesn't exist
    const storageDir = process.env.PDF_STORAGE_PATH || '/tmp/pdfs'
    await mkdir(storageDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedName}`
    const filePath = path.join(storageDir, fileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create document record
    const document = new Document({
      title: file.name.replace('.pdf', ''),
      originalFileName: file.name,
      filePath,
      markdownContent: '', // Will be populated by Docling service
      fileSize: file.size,
      uploadedBy: user._id,
      collection: collectionId || null,
      tags,
      processingStatus: 'pending'
    })

    await document.save()

    // TODO: Trigger Docling processing (async)
    // This would typically be done via a queue system or direct API call
    console.log(`📄 Document ${document._id} en attente de traitement Docling`)

    return NextResponse.json({
      message: 'Fichier uploadé avec succès',
      document: {
        id: document._id,
        title: document.title,
        status: document.processingStatus,
        uploadedAt: document.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur d\'upload:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
