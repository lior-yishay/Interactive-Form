import { ICE_CREAM_SANDWICH_COLLECTION } from "../../../data-access/collections.js"
import { connectToScenesDB } from "../../../data-access/db.js"

export const incrementFlavorByOne = async (flavor) => {
    const db = await connectToScenesDB()
    const collection = db.collection(ICE_CREAM_SANDWICH_COLLECTION)

    await collection.updateOne(
        { name: flavor },
        { $inc: { count: 1 } },
        { upsert: true }
    )
}

export const getAllFlavorsCounts = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(ICE_CREAM_SANDWICH_COLLECTION);

  // Return all documents with only name and count fields
  const results = await collection.find({}, { projection: { _id: 0, name: 1, count: 1 } }).toArray();

  return results;
};