import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '../../../lib/database.js'

export async function GET() {
  try {
    const health = await checkDatabaseHealth()
    
    const overallHealth = Object.values(health).every(status => status)
    
    return NextResponse.json({
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: health,
      version: '1.0.0'
    }, {
      status: overallHealth ? 200 : 503
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}
