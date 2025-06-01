import { AGE_COLLECTION } from "../../../data-access/collections.js"
import { connectToScenesDB } from "../../../data-access/db.js"

export const incrementAgeByOne = async (age) => {
    const db = await connectToScenesDB()
    const collection = db.collection(AGE_COLLECTION)

    await collection.updateOne(
        { name: age },
        { $inc: { count: 1 } },
        { upsert: true }
    )
}

export const getAllAgeCounts = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(AGE_COLLECTION);

  const allDocuments = await collection.find().toArray();

  const result = {};
  for (const doc of allDocuments) {
    result[doc.name] = doc.count;
  }

  return result;
};