import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { I_BELIEVE_IN } from "../../scenes-names.js"
import { Magnet } from "./scene.js"

export const answers = {}

export const setSceneAnswer = (sceneName, value) => {
    answers[sceneName] = value
} 

export const getSceneAnswer = (sceneName) => {
    return answers[sceneName]
}

// server connection
export const getMagnetPositions = async (top) => {
    return await get(I_BELIEVE_IN, {top})   
}

export const postMagnetPositions = async (magnets) => {

    const magnetInfo = magnets.map(magnet => { 
        return { 
            letter: magnet.char,
            x: magnet.pos.x, 
            y: magnet.pos.y
        }
    })
    await post(I_BELIEVE_IN, {magnets: magnetInfo})
    //nextScene()
}

export const getMagnets = async (colors, randomRotationFunc, boundX, boundY, boundW, boundH ) => 
    (await getMagnetPositions(1))[0].magnets
        .map((magnetPosition, index) => 
            new Magnet( magnetPosition.letter,
                        magnetPosition.x,
                        magnetPosition.y,
                        colors[index % colors.length], 
                        randomRotationFunc(), 
                        boundX, 
                        boundY, 
                        boundW, 
                        boundH)) ?? []
