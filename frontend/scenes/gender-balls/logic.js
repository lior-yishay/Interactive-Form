import { get, post } from "../../api/axios.js"
import { EMOTIONS, GENDER_BALLS } from "../../scenes-names.js"
import { setCurrentScene } from "../../sketch.js"
import { setupEmotionsScene } from "../emotions.js"

export const getGenderCounts = async () => {
  return await get(GENDER_BALLS)
}

export const postGenderPick = async (gender) => {
  await post(GENDER_BALLS, {gender})
  nextScene()
}

const nextScene = () => {
    setCurrentScene(EMOTIONS)
    setupEmotionsScene()
}