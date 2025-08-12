import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'
import { connectMongoDB } from '../src/lib/database.js'

async function seedAdmin() {
  try {
    // Connect to database
    await connectMongoDB()
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@docpdf.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log('Email: admin@docpdf.com')
      console.log('Password: admin123')
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@docpdf.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true
    })
    
    await adminUser.save()
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@docpdf.com')
    console.log('🔑 Password: admin123')
    console.log('👑 Role: admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await mongoose.connection.close()
  }
}

// Run the seeder
seedAdmin()
