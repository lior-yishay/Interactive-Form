import { BIG_THING_COLLECTION } from "../../../data-access/collections";
import { getScenePickManager } from "../../scenes-managers/pickManager";
import { BIG_THING_OPTIONS } from "./options";

const bigThingSceneManager = getScenePickManager(BIG_THING_COLLECTION);

export const incrementBigThingPick = bigThingSceneManager.incrementPicks;

export const getBigThingCounts = bigThingSceneManager.getCounts;

export const resetBigThingScene = () =>
  bigThingSceneManager.resetCollection(BIG_THING_OPTIONS);
