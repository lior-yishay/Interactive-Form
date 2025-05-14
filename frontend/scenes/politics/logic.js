import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { POLITICS } from "../../scenes-names.js"

export const getGenderCounts = async () => {
  return await get(POLITICS)
}

export const postPliticsLeft = async () => {
  await post(POLITICS, {side: 'left'})
  nextScene()
}

export const postPliticsCenter = async () => {
  await post(POLITICS, {side: 'center'})
  nextScene()
}

export const postPliticsRight = async () => {
  await post(POLITICS, {side: 'right'})
  nextScene()
}