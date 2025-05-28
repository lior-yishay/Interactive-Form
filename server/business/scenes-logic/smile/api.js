import { SMILE_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const insertSmile = async (duration, image) => {
    const db = await connectToScenesDB()
    const collection = db.collection(SMILE_COLLECTION)

    await collection.insertOne(
        { duration, image }
    )
}

export const getSmileLeaderboard = async (top) => {
    const db = await connectToScenesDB();
    const collection = db.collection(SMILE_COLLECTION);
  
    let query = collection.find({}).sort({ 'duration.max': -1 }).limit(top);;

    if (typeof top === 'number' && top > 0) {
        query = query.limit(top);
    }

    const results = await query.toArray();

    return results.map(({ duration, image }) => ({
    duration: duration.max,
    image
  }));
};

export const getTotalSmileTime = async () => {
    const db = await connectToScenesDB();
    const collection = db.collection(SMILE_COLLECTION);

    const result = await collection.aggregate([{
      $group: {
        _id: null,
        totalDuration: { $sum: "$duration.total" }
      }
    }]).toArray();

    return result[0]?.totalDuration || 0;
}