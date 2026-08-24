import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  const config = useRuntimeConfig()
  const uri = config.mongodbUri

  try {
    await mongoose.connect(uri)
    isConnected = true
    console.log('[MongoDB] Connected successfully')
  } catch (error) {
    console.error('[MongoDB] Connection error:', error)
    throw error
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false
    console.warn('[MongoDB] Disconnected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Error:', err)
    isConnected = false
  })
}
