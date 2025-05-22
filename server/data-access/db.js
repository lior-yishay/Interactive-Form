
import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const SCENES_DB_NAME = 'scenes'
let scenesDB;

export const connectToScenesDB = async () => {
  if (!scenesDB) {
    await client.connect()
    console.log('✅ connected to MongoDB')
    scenesDB = client.db(SCENES_DB_NAME)
  }
  return scenesDB
}

export const closeConnection = async () => {
  if (scenesDB){
    console.log("👋 Closing MongoDB connection...");
    await client.close();
    console.log("✅ MongoDB connection closed.");
  }
}
