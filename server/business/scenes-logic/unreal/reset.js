import { UNREAL_COLLECTION } from "../../../data-access/collections.js";
import { closeConnection, connectToScenesDB } from "../../../data-access/db.js";
import { UNREAL_OPTIONS } from "./options.js";

export const resetUnreal = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(UNREAL_COLLECTION);

  await collection.deleteMany({});

  const unrealDocs = UNREAL_OPTIONS.map((option) => ({
    name: option,
    count: 0,
  }));

  // Insert, replacing existing entries
  const bulkOps = unrealDocs.map((doc) => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true,
    },
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ unreal counts reset.");
};
