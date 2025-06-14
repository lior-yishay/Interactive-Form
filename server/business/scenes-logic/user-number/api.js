import { USER_NUMBER_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const getAndIncrementUserNumber = async () => {
    const db = await connectToScenesDB();
    const collection = db.collection(USER_NUMBER_COLLECTION);

    const result = await collection.findOneAndUpdate(
        { _id: 'userNumber' },               // Identifier for the counter document
        { $inc: { value: 1 } },              // Increment the 'value' field by 1
        {
            returnDocument: 'after',         // Return the document after the update
            upsert: true                     // Create the document if it doesn't exist
        }
    );

    return result.value;
};
