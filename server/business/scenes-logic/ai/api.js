import { AI_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { AI_OPTIONS } from "./options.js";

const aiSceneManager = getScenePickManager(AI_COLLECTION);

export const incrementAiPick = async (pick) =>
  await aiSceneManager.incrementPicks(pick);

export const getAiCounts = async () => await aiSceneManager.getCounts();

export const resetAiScene = async () =>
  await aiSceneManager.resetCollection(AI_OPTIONS);
