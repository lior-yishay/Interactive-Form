import { get, post } from "../../api/axios.js";
import { imageToBase64 } from "../../api/utils.js";
import {
  SMILE,
  SMILE_LEADERBOARD,
  SMILE_TIME,
} from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { getSmileDurationList, getSmileUserImage } from "./scene.js";

export const getSmileLeaderboard = async (top = 3) => {
  const leaderboardBase64 = await get(SMILE_LEADERBOARD, { top });
  return await loadLeaderboardImages(leaderboardBase64);
};

export const getTotalSmileTime = async () => {
  return (await get(SMILE_TIME)).value;
};

export const postSmile = async () => {
  const durationList = getSmileDurationList();
  const image = getSmileUserImage();

  const { max, total } = durationList.reduce(
    (acc, current) => ({
      max: Math.max(acc.max, current),
      total: acc.total + current,
    }),
    { max: -Infinity, total: 0 }
  );

  await post(SMILE, { duration: { max, total }, image: imageToBase64(image) });
  setSceneAnswer(SMILE, { duration: { max, total }, image });
};

const loadLeaderboardImages = async (base64List) => {
  const loadPromises = base64List.map(({ duration, image }) => {
    return new Promise((resolve, reject) => {
      loadImage(
        image,
        (img) => resolve({ duration, image: img }),
        (err) => reject(`failed to load image:${err}`)
      );
    });
  });

  return await Promise.all(loadPromises);
};
