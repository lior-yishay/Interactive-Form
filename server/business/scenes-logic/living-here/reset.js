import { POLITICS_COLLECTION } from "../../../data-access/collections";
import { politicalSides } from "./sides";

export const resetLivingHere = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(POLITICS_COLLECTION);

  await collection.deleteMany({})
  console.log("✅ living here records reset.");
  closeConnection();
};

resetPolitics()