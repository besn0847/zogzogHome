import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/database.js'
import User from '../../../../models/User.js'
import { generateToken, generateRefreshToken, validateEmail, validatePassword } from '../../../../lib/auth.js'

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    validateEmail(email)
    validatePassword(password)

    // Connect to database
    await connectMongoDB()

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim()
    })

    await user.save()

    // Generate tokens
    const accessToken = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    return NextResponse.json({
      message: 'Compte créé avec succès',
      user: user.toJSON(),
      accessToken,
      refreshToken
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
