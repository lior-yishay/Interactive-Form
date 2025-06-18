import { get, post } from "../../api/axios.js";
import { ICE_CREAM_SANDWICH } from "../../scenes-names.js";
import { getIceCreamSandwichUserPick } from "./scene.js";

export const getIceCreamSandwichCounts = async () => {
  return await get(ICE_CREAM_SANDWICH);
};

export const postIceCreamSandwichPick = async () => {
  const flavor = getIceCreamSandwichUserPick();
  await post(ICE_CREAM_SANDWICH, { flavor });
};
