import { get, post } from "../../api/axios.js"
import { imageToBase64 } from "../../api/utils.js"
import { SMILE, SMILE_LEADERBOARD, SMILE_TIME } from "../../scenes-names.js"

export const getSmileLeaderboard = async (top) => {
  return await get(SMILE_LEADERBOARD, {top})
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
  // nextScene()
}