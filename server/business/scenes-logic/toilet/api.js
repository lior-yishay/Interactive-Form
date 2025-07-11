import { TOILET_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { TOILET_OPTIONS } from "./options.js";

const toiletSceneManager = getScenePickManager(TOILET_COLLECTION);

export const incrementToiletPick = toiletSceneManager.incrementPicks;

export const getToiletCounts = () => toiletSceneManager.getCounts();

export const resetToiletScene = () =>
  toiletSceneManager.resetCollection(TOILET_OPTIONS);
