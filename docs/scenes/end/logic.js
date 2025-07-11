import { SMILE_OUTSMILED } from "../../consts/scenes-names";

export const getAiCounts = async (duration) => {
  return await get(SMILE_OUTSMILED, { duration });
};
