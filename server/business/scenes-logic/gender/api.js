import { GENDERS_COLLECTION } from "../../../data-access/collections.js";
import { getScenePickManager } from "../../scenes-managers/pickManager.js";
import { GENDERS } from "./genders.js";

const gendersSceneManager = getScenePickManager(GENDERS_COLLECTION);

export const incrementGenderPick = async (pick) =>
  await gendersSceneManager.incrementPicks(pick);

export const getGendersCounts = async () =>
  await gendersSceneManager.getCounts(true);

export const resetGendersScene = async () =>
  await gendersSceneManager.resetCollection(
    GENDERS.map((gender) => gender.toUpperCase())
  );
