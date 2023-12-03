import mongoose from 'mongoose'

import logger from './logger'

const MONGODB_URI = process.env.MONGO_URI

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
/* @ts-ignore */
let cached = global.mongoose

if (!cached) {
	/* @ts-ignore */
	cached = global.mongoose = { conn: null, promise: null }
}

const connectMongo = async () => {
	if (cached.conn) {
		logger.magenta(`Connected to MongoDB`)
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then(mongoose => {
			logger.magenta(`Connected to MongoDB`)
			return mongoose
		})
	}

	cached.conn = await cached.promise
	return cached.conn
}

export default connectMongo
