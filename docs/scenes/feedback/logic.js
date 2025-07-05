import { get, post } from "../../api/axios.js";
import { FEEDBACK } from "../../consts/scenes-names.js";
import { getUserFeedbackSticker } from "./scene.js";

export const postFeedbackSticker = async () => {
  await post(FEEDBACK, { ...getUserFeedbackSticker() });
};

export const getFeedbackStickers = async () =>
  ((await get(FEEDBACK)) ?? []).map(({ createdOn, ...otherProps }) => ({
    createdOn: new Date(createdOn),
    ...otherProps,
  }));
