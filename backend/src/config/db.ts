import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('⚡ Starting in-memory MongoDB Server for instant local execution...');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'gms_awanpora_erp',
        },
      });
      uri = mongoMemoryServer.getUri();
      console.log(`📦 In-Memory MongoDB running at: ${uri}`);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
