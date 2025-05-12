import { GENDER_BALLS_COLLECTION } from "../../../data-access/collections.js";
import { closeConnection, connectToScenesDB } from "../../../data-access/db.js";
import { genders } from "./genders.js";

export const resetGenders = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(GENDER_BALLS_COLLECTION);

  const genderDocs = genders.map(gender => ({ name: gender, count: 0 }));

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

  closeConnection();
};

resetGenders()