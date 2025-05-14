import { POLITICS_COLLECTION } from "../../../data-access/collections";
import { POLITICAL_SIDES } from "./sides";

export const resetPolitics = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(POLITICS_COLLECTION);

  const politicsDocs = POLITICAL_SIDES.map(side => ({ name: side, count: 0 }));

  // Insert, replacing existing entries
  const bulkOps = politicsDocs.map(doc => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true
    }
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ politics counts reset.");

  closeConnection();
};

resetPolitics()