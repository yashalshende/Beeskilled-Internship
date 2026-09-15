import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance using Mongoose
 * Reads MONGODB_URI from environment variables
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beeskilled_week2';

    const conn = await mongoose.connect(mongoURI);

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Register runtime connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Runtime MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB Disconnected. Attempting to reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    // In production, exiting with 1 is appropriate if DB is critical
    process.exit(1);
  }
};

export default connectDB;
