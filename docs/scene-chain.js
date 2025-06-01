import { p5Functions } from "./p5-scene-functions.js";
import { AGE, AI, END, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => sceneChain[getCurrentScene()]()

const changeToScene = (sceneName) => {
    setCurrentScene(sceneName)
    p5Functions[sceneName].preload()
    p5Functions[sceneName].setup()
}

const sceneChain = {
    [START]: () => changeToScene(NAME),
    [NAME]: () => changeToScene(GENDERS), 
    [GENDERS]: () => changeToScene(AGE),
    [AGE]: () => changeToScene(LIVING_HERE),
    [LIVING_HERE]: () => changeToScene(POLITICS),
    [POLITICS]: () => changeToScene(ICE_CREAM_SANDWICH),
    [ICE_CREAM_SANDWICH]: () => changeToScene(SMILE),
    // [SMILE]: () => changeToScene(UNREAL),
    [SMILE]: () => changeToScene(I_BELIEVE_IN),
    [UNREAL]: () => changeToScene(I_BELIEVE_IN),
    [I_BELIEVE_IN]: () => changeToScene(AI),
    [AI]: () => changeToScene(END),
}