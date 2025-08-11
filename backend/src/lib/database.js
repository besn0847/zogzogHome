import mongoose from 'mongoose'
import Redis from 'ioredis'

let cached = {}

if (!cached.connection) {
  cached.connection = {}
}

if (!cached.promise) {
  cached.promise = {}
}

// MongoDB Connection
export async function connectMongoDB() {
  if (cached.connection.mongo) {
    return cached.connection.mongo
  }

  if (!cached.promise.mongo) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise.mongo = mongoose.connect(process.env.MONGODB_URI, opts)
  }

  try {
    cached.connection.mongo = await cached.promise.mongo
    console.log('✅ MongoDB connecté avec succès')
    return cached.connection.mongo
  } catch (e) {
    console.error('❌ Erreur de connexion MongoDB:', e)
    throw e
  }
}

// Redis Connection
export function connectRedis() {
  if (cached.connection.redis) {
    return cached.connection.redis
  }

  try {
    cached.connection.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    console.log('✅ Redis connecté avec succès')
    return cached.connection.redis
  } catch (e) {
    console.error('❌ Erreur de connexion Redis:', e)
    throw e
  }
}

// Qdrant Connection Helper
export async function connectQdrant() {
  const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333'
  
  try {
    // Test connection to Qdrant
    const response = await fetch(`${qdrantUrl}/collections`)
    if (!response.ok) {
      throw new Error(`Qdrant connection failed: ${response.status}`)
    }
    console.log('✅ Qdrant connecté avec succès')
    return qdrantUrl
  } catch (e) {
    console.error('❌ Erreur de connexion Qdrant:', e)
    throw e
  }
}

// Health check function
export async function checkDatabaseHealth() {
  const health = {
    mongodb: false,
    redis: false,
    qdrant: false
  }

  try {
    await connectMongoDB()
    health.mongodb = true
  } catch (e) {
    console.error('MongoDB health check failed:', e)
  }

  try {
    const redis = connectRedis()
    await redis.ping()
    health.redis = true
  } catch (e) {
    console.error('Redis health check failed:', e)
  }

  try {
    await connectQdrant()
    health.qdrant = true
  } catch (e) {
    console.error('Qdrant health check failed:', e)
  }

  return health
}
