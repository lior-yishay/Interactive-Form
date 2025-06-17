import { nextScene } from "./scene-chain.js"
import { AGE, AI, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js"
import { postGenderPick } from "./scenes/genders/logic.js"
import { getGendersUserPick } from "./scenes/genders/sketch.js"
import { isStrokesEmpty, postName, teardownNameScene } from "./scenes/name/logic.js"
import { getCurrentScene } from "./sketch.js"

export const onNextBtnClick = async () => {
    if (isNextBtnDisabled()) return
    await postSceneUserPicks[getCurrentScene()]()
    nextScene()
}

export const isNextBtnDisabled = () => {
    return hasNoAnswer[getCurrentScene()]() ?? false
}

const postSceneUserPicks = {
    [START]: () => undefined,
    [NAME]: () => {
        postName()
        teardownNameScene()
    }, 
    [GENDERS]: () => postGenderPick(),
    [AGE]: () => undefined,
    [LIVING_HERE]: () => undefined,
    [POLITICS]: () => undefined,
    [ICE_CREAM_SANDWICH]: () => undefined,
    [SMILE]: () => undefined,
    [UNREAL]: () => undefined,
    [I_BELIEVE_IN]: () => undefined,
    [AI]: () => undefined,
}

const hasNoAnswer = {
    [START]: () => undefined,
    [NAME]: isStrokesEmpty, 
    [GENDERS]: () => !getGendersUserPick() ,
    [AGE]: () => undefined,
    [LIVING_HERE]: () => undefined,
    [POLITICS]: () => undefined,
    [ICE_CREAM_SANDWICH]: () => undefined,
    [SMILE]: () => undefined,
    [UNREAL]: () => undefined,
    [I_BELIEVE_IN]: () => undefined,
    [AI]: () => undefined,
} 