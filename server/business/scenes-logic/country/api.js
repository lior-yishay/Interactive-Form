import { COUNTRY_COLLECTION } from "../../../data-access/collections";
import { getSceneManager } from "../../getSceneManager";
import { COUNTRY_OPTIONS } from "./options";

const countrySceneManager = getSceneManager(COUNTRY_COLLECTION);

export const incrementCountryPicks = async (picks) =>
  countrySceneManager.incrementPicks(picks);

export const getCountryCounts = async () => countrySceneManager.getCounts();

export const resetCountryScene = async () =>
  countrySceneManager.resetCollection({
    options: COUNTRY_OPTIONS,
  });
