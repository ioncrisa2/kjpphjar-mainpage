import { connectDB } from '~/server/utils/db'
import { User } from '~/server/models/User'
import bcrypt from 'bcryptjs'

export default defineNitroPlugin(async (nitroApp) => {
  try {
    await connectDB()
    const adminCount = await User.countDocuments()
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const defaultAdmin = new User({
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin'
      })
      await defaultAdmin.save()
      console.log('✅ Default admin user created (username: admin, password: admin123)')
    }
  } catch (error) {
    console.error('❌ Failed to seed default admin user:', error)
  }
})
