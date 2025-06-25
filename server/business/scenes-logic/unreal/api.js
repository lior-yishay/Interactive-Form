import { UNREAL_COLLECTION } from "../../../data-access/collections.js";
import { getSceneManager } from "../../getSceneManager.js";
import { UNREAL_OPTIONS } from "./options.js";

const unrealSceneManager = getSceneManager(UNREAL_COLLECTION);

export const incrementUnrealPicks = async (picks) =>
  await unrealSceneManager.incrementPicks(picks);

export const getUnrealCounts = async () => await unrealSceneManager.getCounts();

export const resetUnrealScene = async () =>
  await unrealSceneManager.resetCollection(UNREAL_OPTIONS);
