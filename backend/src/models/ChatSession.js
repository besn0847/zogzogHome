import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sources: [{
    page: Number,
    content: String,
    score: Number
  }]
}, { _id: true })

const chatSessionSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
chatSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Index for efficient queries
chatSessionSchema.index({ documentId: 1, userId: 1 })
chatSessionSchema.index({ userId: 1, updatedAt: -1 })

const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema)

export default ChatSession
