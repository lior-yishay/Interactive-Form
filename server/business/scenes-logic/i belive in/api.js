import { I_BELIEVE_IN_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const saveMagnetPositions = async (magnets) => {
    const db = await connectToScenesDB()
    const collection = db.collection(I_BELIEVE_IN_COLLECTION)

    await collection.insertOne(
        { createdOn: new Date, magnets }
    )

    return magnets
}

export const getMagnetPositions = async (top) => {
    const db = await connectToScenesDB();
    const collection = db.collection(I_BELIEVE_IN_COLLECTION);
  
    let query = collection.find({}).sort({ createdOn: -1 });

    if (typeof top === 'number' && top > 0) {
        query = query.limit(top);
    }

    return await query.toArray();
};