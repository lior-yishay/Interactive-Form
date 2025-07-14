import { get, post } from "../../api/axios.js";
import { I_BELIEVE_IN } from "../../consts/scenes-names.js";
import {
  getSceneMagnets,
  letterColors,
  Magnet,
  setupNewMagnets,
} from "./scene.js";

// server connection
export const getMagnetRecords = async (top) => {
  return await get(I_BELIEVE_IN, { top });
};

export const postMagnetPositions = async () => {
  const magnets = getSceneMagnets();
  const magnetInfo = magnets.map((magnet) => {
    return {
      letter: magnet.char,
      x: magnet.posNorm.x,
      y: magnet.posNorm.y,
    };
  });
  if (magnetInfo.length === 0) return;
  await post(I_BELIEVE_IN, { magnets: magnetInfo });
};

export const getMagnets = async (randomRotationFunc) => {
  const magnetsRecords = (await getMagnetRecords(1))[0];
  return !magnetsRecords ||
    !magnetsRecords.magnets ||
    magnetsRecords.magnets.length === 0
    ? setupNewMagnets()
    : (magnetsRecords.magnets.map(
        ({ x, y, letter }) =>
          new Magnet(
            letter,
            x,
            y,
            letterColors[letter.toUpperCase()],
            randomRotationFunc()
          )
      ) ?? []);
};
