import { THE_ANSWER_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { THE_ANSWER_OPTIONS } from "./options.js";

const theAnswerSceneManager = getScenePickManager(THE_ANSWER_COLLECTION);

export const incrementTheAnswerPick = theAnswerSceneManager.incrementPicks;

export const getTheAnswerCounts = () => theAnswerSceneManager.getCounts(true);

export const resetTheAnswerScene = () =>
  theAnswerSceneManager.resetCollection(THE_ANSWER_OPTIONS);
