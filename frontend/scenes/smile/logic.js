import { SMILE, SMILE_LEADERBOARD, SMILE_TIME } from "../../scenes-names"

export const getSmileLeaderboard = async () => {
  return await get(SMILE_LEADERBOARD)
}

export const getTotalSmileTime = async () => {
  return await get(SMILE_TIME)
}

export const postSmile = async (durationList, image) => {
  await post(SMILE, {duration: durationList, image})
  nextScene()
}