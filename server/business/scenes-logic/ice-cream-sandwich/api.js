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

  const allDocuments = await collection.find().toArray();

  const result = {};
  for (const doc of allDocuments) {
    result[doc.name] = doc.count;
  }

  return result;
};