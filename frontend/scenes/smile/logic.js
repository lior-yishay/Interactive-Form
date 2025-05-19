import { get, post } from "../../api/axios.js"
import { imageToBase64 } from "../../api/utils.js"
import { nextScene } from "../../scene-chain.js"
import { SMILE, SMILE_LEADERBOARD, SMILE_TIME } from "../../scenes-names.js"

export const getSmileLeaderboard = async (top) => {
  const leaderboardBase64 = await get(SMILE_LEADERBOARD, {top})
  return await loadLeaderboardImages(leaderboardBase64)
}

export const getTotalSmileTime = async () => {
  return await get(SMILE_TIME)
}

export const postSmile = async (durationList, image) => {
  const { max, total } = durationList.reduce((acc, current) => ({ 
    max: Math.max(acc.max, current), 
    total: acc.total + current
  }), { max: -Infinity, total: 0 });

  await post(SMILE, {duration: {max, total}, image: imageToBase64(image)})
  //nextScene()
}

const loadLeaderboardImages = async (base64List) => {
  const loadPromises = base64List.map(({ duration, image }) => {
    return new Promise((resolve, reject) => {
      loadImage(image, 
        (img) => resolve({ duration, image: img }),
        (err) => reject(`failed to load image:${err}`));
    });
  });

  return await Promise.all(loadPromises);
}