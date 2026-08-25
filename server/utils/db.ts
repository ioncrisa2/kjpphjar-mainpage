import mongoose from 'mongoose'

let connectionPromise: ReturnType<typeof mongoose.connect> | null = null
let listenersAttached = false

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose
  if (connectionPromise) return connectionPromise

  const config = useRuntimeConfig()
  const uri = config.mongodbUri

  if (!listenersAttached) {
    listenersAttached = true
    mongoose.connection.on('disconnected', () => {
      connectionPromise = null
      console.warn('[MongoDB] Disconnected')
    })

    mongoose.connection.on('error', (error) => {
      console.error('[MongoDB] Error:', error)
      connectionPromise = null
    })
  }

  connectionPromise = mongoose.connect(uri)

  try {
    const connection = await connectionPromise
    console.log('[MongoDB] Connected successfully')
    return connection
  } catch (error) {
    connectionPromise = null
    console.error('[MongoDB] Connection error:', error)
    throw error
  }
}
