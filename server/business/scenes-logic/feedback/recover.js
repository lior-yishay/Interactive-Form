import dotenv from "dotenv";
import { saveFeedbackRecord } from "./api.js";
dotenv.config({ path: "../../../.env" });

const FEEDBACK_TEXTS = [
  "i cast fireball",
  "nice try",
  "mmmmmm wow",
  "hello you all",
  "meow",
  "amazing",
  "lovely",
  "happy",
  "love it xoxo",
  "wowww",
  "xoxo",
  "peace",
  "cool",
  "nicely done",
  "very nice",
  "magic vibes",
  "fun times",
  "this is wild",
  "haha wow",
  "great stuff",
  "so cute",
  "big win",
  "tiny chaos",
  "pure joy",
  "epic",
  "well played",
  "good vibes",
  "yay",
  "fire move",
  "sweet",
  "gold star",
  "wild energy",
  "super fun",
  "hello world",
  "sparkles",
  "nice magic",
  "hehe",
  "go go go",
  "wow nice",
  "best day",
  "cool beans",
  "party time",
  "legend",
  "green wizard",
  "moon power",
  "sunshine",
  "fancy",
  "bravo",
  "shiny",
  "so good",
  "bring them home",
  "we are the sun of the world",
  "egg",
  "bingus",
  "to the unknown",
];

const randomFloat = (min, max) => Math.random() * (max - min) + min;

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const weightedRotation = () => {
  // Creates values between -0.5 and 0.5
  // Much more likely to be near 0
  // Math.pow biases toward smaller numbers
  const magnitude = Math.pow(Math.random(), 2) * 0.5;

  // Randomly choose positive or negative
  return Math.random() < 0.5 ? -magnitude : magnitude;
};

const generateFeedbackRecord = () => ({
  x: randomFloat(0.05, 0.95), // avoid edges
  y: randomFloat(0.05, 0.95),
  scale: 1,
  rotation: weightedRotation(),
  shapeIndex: randomInt(0, 5),
  colorIndex: randomInt(0, 4),
  text: FEEDBACK_TEXTS[randomInt(0, FEEDBACK_TEXTS.length - 1)],
});

export const seedFeedbackCollection = async (count = 100) => {
  try {
    for (let i = 0; i < count; i++) {
      const feedback = generateFeedbackRecord();
      await saveFeedbackRecord(feedback);

      console.log(
        `✅ Added ${i + 1}/${count}: "${feedback.text}" at (${feedback.x.toFixed(
          2,
        )}, ${feedback.y.toFixed(2)})`,
      );
    }

    console.log(`🎉 Successfully added ${count} feedback records.`);
  } catch (error) {
    console.error("❌ Failed to seed feedback:", error);
  }
};

// Run directly
seedFeedbackCollection();
