import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { I_BELIEVE_IN } from "../../scenes-names.js"
import { Magnet, setupMagnets } from "./scene.js"

export const answers = {}
let canvasWidth
let canvasHeight

export const setSceneAnswer = (sceneName, value) => {
    answers[sceneName] = value
} 

export const getSceneAnswer = (sceneName) => {
    return answers[sceneName]
}

// server connection
export const getMagnetRecords = async (top) => {
    return await get(I_BELIEVE_IN, {top})   
}

export const postMagnetPositions = async (magnets) => {

    const magnetInfo = magnets.map(magnet => { 
        return { 
            letter: magnet.char,
            x: magnet.pos.x / width, 
            y: magnet.pos.y / height
        }
    })
    await post(I_BELIEVE_IN, {magnets: magnetInfo})
    //nextScene()
}

export const getMagnets = async (colors, randomRotationFunc, boundX, boundY, boundW, boundH) => {
    canvasWidth = width
    canvasHeight = height
    const magnetsRecords = (await getMagnetRecords(1))[0]
    return !magnetsRecords 
            ? setupMagnets() 
            : magnetsRecords.magnets.map((magnetPosition, index) => 
                new Magnet( magnetPosition.letter,
                            magnetPosition.x * width,
                            magnetPosition.y * height,
                            colors[index % colors.length], 
                            randomRotationFunc(), 
                            boundX, 
                            boundY, 
                            boundW, 
                            boundH)) ?? []
}


export const updateWindowSizeAndMagnetsPos = (magnets) => {
    magnets.forEach(magnet => {
        magnet.pos.x *= width / canvasWidth
        magnet.pos.y *= height / canvasHeight
        magnet.target.x *= width / canvasWidth
        magnet.target.y *= height / canvasHeight
        console.log(magnet.pos.x, magnet.pos.y)
    });

    canvasWidth = width
    canvasHeight = height

    console.log(magnets,canvasWidth,canvasHeight)
}