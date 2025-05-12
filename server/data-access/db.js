
import { MongoClient, ServerApiVersion } from 'mongodb'
import { admin } from './users.js'

// const uri = `mongodb+srv://${admin.username}:${admin.password}@cluster.qkx7xp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;
const uri = "mongodb+srv://adnimDB:k3gK7lIDtvnQYUWW@cluster.qkx7xp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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
