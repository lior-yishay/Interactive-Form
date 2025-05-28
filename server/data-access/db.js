
import { MongoClient, ServerApiVersion } from 'mongodb';

let client
const SCENES_DB_NAME = 'scenes'
let scenesDB;

export const createMongoClient = () => {
  const MONGO_URI = process.env.MONGO_URI
  client = new MongoClient(MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
}

export const connectToScenesDB = async () => {
  if(!client) createMongoClient()

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
