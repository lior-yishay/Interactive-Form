import { UNREAL_COLLECTION } from "../../../data-access/collections.js"
import { connectToScenesDB } from "../../../data-access/db.js"

export const incrementUnrealPicksByOne = async (unrealPicks) => {
    const db = await connectToScenesDB()
    const collection = db.collection(UNREAL_COLLECTION)

    const bulkOps = unrealPicks.map(pick => ({
        updateOne: {
            filter: { name: pick },
            update: { $inc: { count: 1 } },
            upsert: true
        }
    }));

    await collection.bulkWrite(bulkOps);
}

export const getAllUnrealCounts = async () => {
    const db = await connectToScenesDB();
    const collection = db.collection(UNREAL_COLLECTION);

    const allDocuments = await collection.find().toArray();

    const result = {};
    for (const doc of allDocuments) {
        result[doc.name] = doc.count;
    }

    return result;
};