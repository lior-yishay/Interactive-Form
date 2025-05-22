import { setupScene } from "./scene-setup.js";
import { AGE, AI, END, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => sceneChain[getCurrentScene()]()

const changeScene = (sceneName) => {
    setCurrentScene(sceneName)
    setupScene(sceneName)
}

const sceneChain = {
    [START]: () => changeScene(NAME),
    [NAME]: () => changeScene(GENDERS), 
    [GENDERS]: () => changeScene(AGE),
    [AGE]: () => changeScene(AGE),
    [LIVING_HERE]: () => changeScene(AGE),
    [POLITICS]: () => changeScene(AGE),
    [ICE_CREAM_SANDWICH]: () => changeScene(AGE),
    [SMILE]: () => changeScene(AGE),
    [UNREAL]: () => changeScene(AGE),
    [I_BELIEVE_IN]: () => changeScene(AGE),
    [AI]: () => changeScene(END),
}