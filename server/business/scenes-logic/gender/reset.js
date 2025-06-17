import { GENDERS_COLLECTION } from "../../../data-access/collections.js";
import { closeConnection, connectToScenesDB } from "../../../data-access/db.js";
import { GENDERS } from "./genders.js";

export const resetGenders = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(GENDERS_COLLECTION);

  await collection.deleteMany({})

  const genderDocs = GENDERS.map(gender => ({ name: gender.toUpperCase(), count: 0 }));

  // Insert, replacing existing entries
  const bulkOps = genderDocs.map(doc => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true
    }
  }));

  await collection.bulkWrite(bulkOps);
  console.log("✅ Gender counts reset.");

};
