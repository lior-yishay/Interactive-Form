import { UNREAL } from "../../../../frontend/scenes-names.js";
import { ICE_CREAM_SANDWICH_COLLECTION } from "../../../data-access/collections.js";
import { closeConnection, connectToScenesDB } from "../../../data-access/db.js";
import { FLAVORS } from "./flavors.js";
import { UNREAL_OPTIONS } from "./options.js";

export const resetGenders = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(UNREAL);

  const unrealDocs = UNREAL_OPTIONS.map(optoin => ({ name: option, count: 0 }));

  // Insert, replacing existing entries
  const bulkOps = unrealDocs.map(doc => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true
    }
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ unreal counts reset.");

  closeConnection();
};

resetGenders()