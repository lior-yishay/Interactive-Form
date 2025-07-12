import { BINGO_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { TV_SHOWS } from "./options.js";

const bingoSceneManager = getScenePickManager(BINGO_COLLECTION);

export const incrementBingoPicks = bingoSceneManager.incrementPicks;

export const getBingoCounts = () => bingoSceneManager.getCounts(true);

export const resetBingoScene = () =>
  bingoSceneManager.resetCollection(TV_SHOWS);
