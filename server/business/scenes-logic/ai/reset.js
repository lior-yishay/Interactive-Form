import { AI_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";
import { AI_OPTIONS } from "./options.js";

export const resetAi = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(AI_COLLECTION);

  await collection.deleteMany({});

  const AiDocs = AI_OPTIONS.map((aiOption) => ({ name: aiOption, count: 0 }));

  // Insert, replacing existing entries
  const bulkOps = AiDocs.map((doc) => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true,
    },
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ ai counts reset.");
};
