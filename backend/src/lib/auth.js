import jwt from 'jsonwebtoken'
import { connectMongoDB } from './database.js'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

// Generate refresh token
export function generateRefreshToken(userId) {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Token invalide')
  }
}

// Middleware to authenticate requests
export async function authenticateUser(req) {
  try {
    console.log('Auth headers:', req.headers)
    console.log('Authorization header:', req.headers.authorization)
    console.log('Headers get:', req.headers.get ? req.headers.get('authorization') : 'No get method')
    
    const authHeader = req.headers.authorization || req.headers.get?.('authorization')
    console.log('Final authHeader:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token d\'authentification manquant')
    }

    const token = authHeader.substring(7)
    console.log('Extracted token:', token)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // Development mode: Accept mock tokens
    if (process.env.NODE_ENV !== 'production' && token.startsWith('dev-mock-jwt-token-')) {
      console.log('Using mock authentication for development')
      
      // Return a mock user for development
      return {
        _id: 'dev-user-id',
        email: 'dev@example.com',
        firstName: 'Développeur',
        lastName: 'Test',
        isActive: true,
        role: 'user'
      }
    }
    
    const decoded = verifyToken(token)
    
    if (decoded.type !== 'access') {
      throw new Error('Type de token invalide')
    }

    await connectMongoDB()
    const user = await User.findById(decoded.userId)
    
    if (!user || !user.isActive) {
      throw new Error('Utilisateur introuvable ou inactif')
    }

    return user
  } catch (error) {
    throw new Error(`Authentification échouée: ${error.message}`)
  }
}

// Middleware to check admin role
export async function requireAdmin(req) {
  const user = await authenticateUser(req)
  
  if (user.role !== 'admin') {
    throw new Error('Accès administrateur requis')
  }
  
  return user
}

// Extract user from request (for optional auth)
export async function getOptionalUser(req) {
  try {
    return await authenticateUser(req)
  } catch (error) {
    return null
  }
}

// Rate limiting helper
export function createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
  const requests = new Map()
  
  return (identifier) => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(identifier)) {
      requests.set(identifier, [])
    }
    
    const userRequests = requests.get(identifier)
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart)
    requests.set(identifier, validRequests)
    
    if (validRequests.length >= max) {
      throw new Error('Trop de requêtes, veuillez réessayer plus tard')
    }
    
    validRequests.push(now)
    return true
  }
}

// Password validation
export function validatePassword(password) {
  if (!password || password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères')
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
  }
  
  return true
}

// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Format d\'email invalide')
  }
  return true
}
