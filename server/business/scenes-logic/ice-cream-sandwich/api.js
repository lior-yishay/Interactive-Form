import { ICE_CREAM_SANDWICH_COLLECTION } from "../../../data-access/collections.js";
import { getSceneManager } from "../../getSceneManager.js";
import { FLAVORS } from "./flavors.js";

const iceCreamSandwichSceneManager = getSceneManager(
  ICE_CREAM_SANDWICH_COLLECTION
);

export const incrementIceCreamSandwichPick = async (pick) =>
  await iceCreamSandwichSceneManager.incrementPicks(pick);

export const getIceCreamSandwichCounts = async () =>
  await iceCreamSandwichSceneManager.getCounts();

export const resetIceCreamSandwichScene = async () =>
  await iceCreamSandwichSceneManager.resetCollection(FLAVORS);
