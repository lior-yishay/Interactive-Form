import { COUNTRY_COLLECTION } from "../../../data-access/collections.js";
import { getSceneManager } from "../../getSceneManager.js";
import { COUNTRY_OPTIONS } from "./options.js";

const countrySceneManager = getSceneManager(COUNTRY_COLLECTION);

export const incrementCountryPicks = async (picks) =>
  await countrySceneManager.incrementPicks(picks);

export const getCountryCounts = async () =>
  await countrySceneManager.getCounts();

export const resetCountryScene = async () =>
  await countrySceneManager.resetCollection(COUNTRY_OPTIONS);
