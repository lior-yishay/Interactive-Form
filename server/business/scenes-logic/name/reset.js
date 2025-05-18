import { NAME_COLLECTION } from "../../../data-access/collections";

export const resetName = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(NAME_COLLECTION);

  await collection.deleteMany({})
  console.log("✅ name records reset.");
  closeConnection();
};

resetName()