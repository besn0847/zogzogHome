import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  markdownContent: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null
  },
  metadata: {
    author: String,
    subject: String,
    keywords: [String],
    pageCount: Number,
    language: String,
    extractedAt: Date
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  qdrantPointId: {
    type: String,
    default: null
  },
  embeddings: {
    generated: {
      type: Boolean,
      default: false
    },
    model: String,
    chunkCount: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for better performance
documentSchema.index({ uploadedBy: 1, createdAt: -1 })
documentSchema.index({ title: 'text', 'metadata.author': 'text', 'metadata.subject': 'text' })
documentSchema.index({ tags: 1 })
documentSchema.index({ collection: 1 })
documentSchema.index({ processingStatus: 1 })

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function() {
  return `/api/documents/${this._id}/download`
})

// Method to check if user has access
documentSchema.methods.hasAccess = function(userId, permission = 'read') {
  // Owner always has access
  if (this.uploadedBy.toString() === userId.toString()) {
    return true
  }
  
  // Check if document is public for read access
  if (this.isPublic && permission === 'read') {
    return true
  }
  
  // Check shared permissions
  const sharedAccess = this.sharedWith.find(
    share => share.user.toString() === userId.toString()
  )
  
  if (!sharedAccess) return false
  
  if (permission === 'read') return true
  if (permission === 'write') return sharedAccess.permission === 'write'
  
  return false
}

// Static method to find accessible documents for user
documentSchema.statics.findAccessible = function(userId, options = {}) {
  const query = {
    $or: [
      { uploadedBy: userId },
      { isPublic: true },
      { 'sharedWith.user': userId }
    ]
  }
  
  if (options.collection) {
    query.collection = options.collection
  }
  
  if (options.status) {
    query.processingStatus = options.status
  }
  
  return this.find(query)
}

export default mongoose.models.Document || mongoose.model('Document', documentSchema)
