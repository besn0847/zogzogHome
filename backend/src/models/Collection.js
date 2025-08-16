import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: /^#[0-9A-F]{6}$/i
  },
  icon: {
    type: String,
    default: 'folder'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowPublicDocuments: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    autoTagging: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    documentCount: {
      type: Number,
      default: 0
    },
    totalSize: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  shareTokenExpiresAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes
collectionSchema.index({ createdBy: 1, name: 1 })
collectionSchema.index({ isPublic: 1 })
collectionSchema.index({ 'members.user': 1 })

// Method to check if user has access to collection
collectionSchema.methods.hasAccess = function(userId, requiredRole = 'viewer') {
  // Owner always has access
  if (this.createdBy.toString() === userId.toString()) {
    return true
  }
  
  // Check if collection is public for viewer access
  if (this.isPublic && requiredRole === 'viewer') {
    return true
  }
  
  // Check member permissions
  const member = this.members.find(
    m => m.user.toString() === userId.toString()
  )
  
  if (!member) return false
  
  const roleHierarchy = { viewer: 1, editor: 2, owner: 3 }
  return roleHierarchy[member.role] >= roleHierarchy[requiredRole]
}

// Method to add member to collection
collectionSchema.methods.addMember = function(userId, role = 'viewer') {
  const existingMember = this.members.find(
    m => m.user.toString() === userId.toString()
  )
  
  if (existingMember) {
    existingMember.role = role
  } else {
    this.members.push({ user: userId, role })
  }
  
  return this.save()
}

// Static method to find accessible collections for user
collectionSchema.statics.findAccessible = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { isPublic: true },
      { 'members.user': userId }
    ]
  }).populate('createdBy', 'firstName lastName email')
}

export default mongoose.models.Collection || mongoose.model('Collection', collectionSchema)
