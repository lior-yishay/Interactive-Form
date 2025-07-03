import { post } from "./api/axios.js";
import { USER_NUMBER } from "./consts/scenes-names.js";

let currentUserPromise;

export const getCurrentUser = async () => {
  if (!currentUserPromise) {
    currentUserPromise = post(USER_NUMBER).then((res) => res.value);
  }
  return currentUserPromise;
};
