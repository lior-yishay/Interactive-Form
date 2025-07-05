import { UNREAL_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { UNREAL_OPTIONS } from "./options.js";

const unrealSceneManager = getScenePickManager(UNREAL_COLLECTION);

export const incrementUnrealPicks = async (picks) =>
  await unrealSceneManager.incrementPicks(picks);

export const getUnrealCounts = async () => await unrealSceneManager.getCounts();

export const resetUnrealScene = async () =>
  await unrealSceneManager.resetCollection(UNREAL_OPTIONS);
