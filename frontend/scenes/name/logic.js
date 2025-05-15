import { get, post } from "../../api/axios"

export const getNameHistory = async (top) => {
  return await get(NAME, {top})
}

export const postName = async (strokes) => {
  await post(NAME, {strokes})
  nextScene()
}