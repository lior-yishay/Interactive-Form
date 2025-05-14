import { LIVING_HERE_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const postLivingHerePick = async (x, y, pick) => {
    const db = await connectToScenesDB()
    const collection = db.collection(LIVING_HERE_COLLECTION)

    await collection.insertOne(
        { x, y, pick }
    )
}

export const getAllLivingHereRecords = async () => {
  const db = await connectToScenesDB();
    const collection = db.collection(LIVING_HERE_COLLECTION);
  
    // Return all documents with only name and count fields
    const results = await collection.find({}, { projection: { _id: 0, x: 1, y: 1, pick: 1 } }).toArray();
  
    return results;
};