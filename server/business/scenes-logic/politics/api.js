import { POLITICS_COLLECTION } from "../../../data-access/collections.js";
import { getSceneManager } from "../../getSceneManager.js";
import { POLITICAL_SIDES } from "./sides.js";

const politicsSceneManager = getSceneManager(POLITICS_COLLECTION);

export const incrementPoliticsPick = async (pick) =>
  await politicsSceneManager.incrementPicks(pick);

export const getPoliticsCounts = async () =>
  await politicsSceneManager.getCounts();

export const resetPoliticsScene = async () =>
  await politicsSceneManager.resetCollection(POLITICAL_SIDES);
