import { ICE_CREAM_SANDWICH_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { FLAVORS } from "./flavors.js";

const iceCreamSandwichSceneManager = getScenePickManager(
  ICE_CREAM_SANDWICH_COLLECTION
);

export const incrementIceCreamSandwichPick = async (pick) =>
  await iceCreamSandwichSceneManager.incrementPicks(pick);

export const getIceCreamSandwichCounts = async () =>
  await iceCreamSandwichSceneManager.getCounts();

export const resetIceCreamSandwichScene = async () =>
  await iceCreamSandwichSceneManager.resetCollection(FLAVORS);
