import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { POLITICS } from "../../scenes-names.js"
import { getPoliticsCounts } from "../../../proxy server/proxyServer.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"
// import { addBall } from "./scene.js"
// import { Ball, balls } from "./scene.js"

export const getPoliticsCounts = async () => {
  return await get(POLITICS)
}

export const postPoliticsLeft = async () => {
  await postPoliticsPick('left')
}

export const postPoliticsCenter = async () => {
  await postPoliticsPick('center')
}

export const postPoliticsRight = async () => {
  await postPoliticsPick('right')
}

const postPoliticsPick = async (side) => {
  await post(POLITICS, {side})
  setSceneAnswer(POLITICS, {side})
  nextScene()
}

// export const generateBalls = async (leftMinX, leftMaxX, centerMinX, centerMaxX, rightMinX, rightMaxX, y = 750 ) => {
//   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//   const politicsCounts = getPoliticsCounts()

//   for(let i = 0; i < politicsCounts.left; i++){
//     const xPosition = random(leftMinX, leftMaxX)
//     balls.push(new Ball(xPosition, y, 'x'));
//     // await sleep(50)
//   }

//   console.log('finished')
// }

