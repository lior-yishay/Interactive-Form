import { SMILE, GENDER_BALLS } from "./scenes-names.js";
import { setupSmileScene } from "./scenes/smile/smile.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => {
    switch(getCurrentScene()){
        case GENDER_BALLS: 
            setCurrentScene(SMILE)
            setupSmileScene()
            break
    }
}