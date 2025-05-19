import { GENDERS_COLLECTION } from "../../../data-access/collections.js"
import { connectToScenesDB } from "../../../data-access/db.js"

export const incrementGenderByOne = async (gender) => {
    const db = await connectToScenesDB()
    const collection = db.collection(GENDERS_COLLECTION)

    await collection.updateOne(
        { name: gender },
        { $inc: { count: 1 } },
        { upsert: true }
    )
}

export const getAllGenderCounts = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(GENDERS_COLLECTION);

  // Return all documents with only name and count fields
  const results = await collection.find({}, { projection: { _id: 0, name: 1, count: 1 } }).toArray();

  return results;
};