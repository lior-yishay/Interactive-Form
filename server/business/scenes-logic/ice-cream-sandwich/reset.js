import { ICE_CREAM_SANDWICH_COLLECTION } from "../../../data-access/collections.js";
import { closeConnection, connectToScenesDB } from "../../../data-access/db.js";
import { FLAVORS } from "./flavors.js";

export const resetIceCreamSandwich = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(ICE_CREAM_SANDWICH_COLLECTION);

  await collection.deleteMany({});

  const FlavorDocs = FLAVORS.map((flavor) => ({ name: flavor, count: 0 }));

  // Insert, replacing existing entries
  const bulkOps = FlavorDocs.map((doc) => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true,
    },
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ ice-cream-sandwich counts reset.");
};
