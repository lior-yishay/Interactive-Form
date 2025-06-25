import { AI_COLLECTION } from "../../../data-access/collections.js";
import { getSceneManager } from "../../getSceneManager.js";
import { AI_OPTIONS } from "./options.js";

const aiSceneManager = getSceneManager(AI_COLLECTION);

export const incrementAiPick = async (pick) =>
  await aiSceneManager.incrementPicks(pick);

export const getAiCounts = async () => await aiSceneManager.getCounts();

export const resetAiScene = async () =>
  await aiSceneManager.resetCollection(AI_OPTIONS);
