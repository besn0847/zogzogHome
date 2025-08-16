import { NextResponse } from 'next/server'
import { authenticateUser } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    // Authenticate user using existing auth middleware
    const user = await authenticateUser(request)
    
    // If authentication succeeds, return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim() || user.email
      }
    })

  } catch (error) {
    console.error('Auth verification failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Authentication failed' 
      },
      { status: 401 }
    )
  }
}
