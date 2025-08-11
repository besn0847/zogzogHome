import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/database.js'
import User from '../../../../models/User.js'
import { generateToken, generateRefreshToken, validateEmail } from '../../../../lib/auth.js'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    validateEmail(email)

    // Connect to database
    await connectMongoDB()

    // Find user
    const user = await User.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const accessToken = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    return NextResponse.json({
      message: 'Connexion réussie',
      user: user.toJSON(),
      accessToken,
      refreshToken
    })

  } catch (error) {
    console.error('Erreur de connexion:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
