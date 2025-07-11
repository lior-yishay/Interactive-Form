import { get } from "../../api/axios.js";
import { SMILE_OUTSMILED } from "../../consts/scenes-names.js";

export const getOutsmiledCounts = async (duration) => {
  return (await get(SMILE_OUTSMILED, { duration })).value;
};
