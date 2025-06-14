import { nextScene } from "./scene-chain.js"
import { AGE, AI, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js"
import { postName } from "./scenes/name/logic.js"
import { getCurrentScene } from "./sketch.js"

export const onNextBtnClick = async () => {
    await postSceneUserPicks[getCurrentScene()]()
    nextScene()
}

const postSceneUserPicks = {
    [START]: () => undefined,
    [NAME]: postName, 
    [GENDERS]: () => undefined,
    [AGE]: () => undefined,
    [LIVING_HERE]: () => undefined,
    [POLITICS]: () => undefined,
    [ICE_CREAM_SANDWICH]: () => undefined,
    [SMILE]: () => undefined,
    [UNREAL]: () => undefined,
    [I_BELIEVE_IN]: () => undefined,
    [AI]: () => undefined,
}