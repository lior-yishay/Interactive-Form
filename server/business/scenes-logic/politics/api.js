import { POLITICS_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const incrementPoliticalSideByOne = async (side) => {
    const db = await connectToScenesDB()
    const collection = db.collection(POLITICS_COLLECTION)

    await collection.updateOne(
        { name: side },
        { $inc: { count: 1 } },
        { upsert: true }
    )
}

export const getAllPoliticalSideCounts = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(GENDER_BALLS_COLLECTION);

  const allDocuments = await collection.find().toArray();

  const result = {};
  for (const doc of allDocuments) {
    result[doc.name] = doc.count;
  }

  return result;
};