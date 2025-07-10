import { BIG_THING_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { BIG_THING_OPTIONS } from "./options.js";

const bigThingSceneManager = getScenePickManager(BIG_THING_COLLECTION);

export const incrementBigThingPick = bigThingSceneManager.incrementPicks;

export const getBigThingCounts = bigThingSceneManager.getCounts;

export const resetBigThingScene = () =>
  bigThingSceneManager.resetCollection(BIG_THING_OPTIONS);
