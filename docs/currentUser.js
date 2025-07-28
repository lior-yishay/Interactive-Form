import { emptyPost, post } from "./api/axios.js";
import { isLocal } from "./api/utils.js";
import { USER_NUMBER } from "./consts/scenes-names.js";

let currentUserPromise;

export const getCurrentUser = async () => {
  if (isLocal) return 10641;
  if (!currentUserPromise) {
    currentUserPromise = emptyPost(USER_NUMBER).then((res) => res.value);
  }
  return currentUserPromise;
};
