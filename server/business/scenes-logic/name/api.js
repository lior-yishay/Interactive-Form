import { NAME_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const postName = async (strokes) => {
    const db = await connectToScenesDB()
    const collection = db.collection(NAME_COLLECTION)

    await collection.insertOne(
        { createdOn: new Date, strokes }
    )

    return strokes
}

export const getNameHistory = async (top) => {
    const db = await connectToScenesDB();
    const collection = db.collection(NAME_COLLECTION);
  
    let query = collection.find({}).sort({ createdOn: -1 });

    if (typeof top === 'number' && top > 0) {
        query = query.limit(top);
    }

    return await query.toArray();
};