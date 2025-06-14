import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { NAME } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

const strokes = []

export const getNameHistory = async (top) => {
  return await get(NAME, {top})
}

export const postName = async () => {
  console.log(strokes)
  await post(NAME, {strokes})
  setSceneAnswer(NAME, {strokes})
}

export const drawNameHistory = async (top) => {
  const nameHistory = await getNameHistory(top)

  const MAX_ALPHA = 50
  const MIN_ALPHA = 5
    
  const drawLine = ({from, to, colorValue, alpha, weight}) => {
    if(colorValue) {
      noErase()
      const c = color(colorValue)
      c.setAlpha(alpha)
      stroke(c)
    } 
    else erase()

    strokeWeight(weight);
    strokeCap(ROUND);
    line(from.x, from.y, to.x, to.y);
  }

  nameHistory.forEach(({strokes}, index) => {
    const alpha = ( (MAX_ALPHA - MIN_ALPHA) / nameHistory.length ) * (nameHistory.length - index) + MIN_ALPHA
    strokes.forEach(stroke => drawLine({...stroke, alpha}))
  });
}

export const recordStroke = (from, to, colorValue, weight) => {
    strokes.push({from, to, colorValue, weight})
}