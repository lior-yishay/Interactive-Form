import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { LIVING_HERE } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export const getLivingHereCounts = async () => {
  return await get(LIVING_HERE)
}

export  const postLivingHere_iWillNot = async () => {
  await postLivingHerePick("i will not")
}

export  const postLivingHere_education = async () => {
  await postLivingHerePick("education")
}

export  const postLivingHere_mentalHealth = async () => {
  await postLivingHerePick("mental health")
}

export  const postLivingHere_betterFuture = async () => {
  await postLivingHerePick("better future")
}

export  const postLivingHere_job = async () => {
  await postLivingHerePick("job")
}

const postLivingHerePick = async (pick) => {
  await post(LIVING_HERE, {pick})
  setSceneAnswer(LIVING_HERE, {pick})
  nextScene()
}