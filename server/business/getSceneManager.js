import { connectToScenesDB } from "../data-access/db";

export const getSceneManager = (collectionName) => {
  return {
    incrementPicks: async (picks) => {
      const db = await connectToScenesDB();
      const collection = db.collection(collectionName);

      const pickArray = Array.isArray(picks) ? picks : [picks];

      const bulkOps = pickArray.map((pick) => ({
        updateOne: {
          filter: { name: pick },
          update: { $inc: { count: 1 } },
          upsert: true,
        },
      }));

      await collection.bulkWrite(bulkOps);
    },

    getCounts: async ({ asList = false }) => {
      const db = await connectToScenesDB();
      const collection = db.collection(collectionName);

      const documents = await collection
        .find({}, { projection: { _id: 0, name: 1, count: 1 } })
        .toArray();

      if (!asList) {
        //return a single object
        return documents.reduce((acc, { name, count }) => {
          acc[name] = count;
          return acc;
        }, {});
      }

      return documents;
    },

    resetCollection: async ({ options }) => {
      const db = await connectToScenesDB();
      const collection = db.collection(collectionName);

      await collection.deleteMany({});

      const docs = options.map((opt) => ({ name: opt, count: 0 }));

      const bulkOps = docs.map((doc) => ({
        updateOne: {
          filter: { name: doc.name },
          update: { $set: doc },
          upsert: true,
        },
      }));

      await collection.bulkWrite(bulkOps);
      console.log(`✅ ${collectionName} reset.`);
    },
  };
};
