// Folder file name format:
// max: 12, total: 45.jpg

import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { connectToScenesDB } from "../../../data-access/db.js";
import { SMILE_COLLECTION } from "../../../data-access/collections.js";

dotenv.config({ path: "../../../.env" });

const IMAGE_FOLDER_PATH = ""; // change to your folder path

// Matches:
// max: 12, total: 45.jpg
// max: 12, total: 45 (1).jpg
const FILE_NAME_REGEX =
  /^max\s*(\d+)\s*,\s*total\s*(\d+)(?:\s*\(\d+\))?\.(jpg)$/i;

const imageFileToBase64 = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const mimeType = "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const importSmileImagesToDB = async (folderPath = IMAGE_FOLDER_PATH) => {
  const db = await connectToScenesDB();
  const collection = db.collection(SMILE_COLLECTION);

  const files = await fs.readdir(folderPath);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const fileName of files) {
    const match = fileName.match(FILE_NAME_REGEX);

    if (!match) {
      console.log(`⏭ Skipped invalid file name: ${fileName}`);
      skippedCount++;
      continue;
    }

    const [, maxStr, totalStr, ext] = match;

    const max = Number(maxStr);
    const total = Number(totalStr);

    const fullPath = path.join(folderPath, fileName);

    try {
      const imageBase64 = await imageFileToBase64(fullPath, ext);

      await collection.insertOne({
        duration: {
          max,
          total,
        },
        image: imageBase64,
      });

      insertedCount++;
      console.log(`✅ Imported: ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to import ${fileName}:`, error);
    }
  }

  console.log(`
🎉 Import complete!
Inserted: ${insertedCount}
Skipped: ${skippedCount}
`);
};

// Run directly
importSmileImagesToDB().catch(console.error);
