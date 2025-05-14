import { SMILE, GENDER_BALLS } from "./scenes-names.js";
import { setupEmotionsScene } from "./scenes/emotions.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => {
    switch(getCurrentScene()){
        case GENDER_BALLS: 
            setCurrentScene(SMILE)
            setupEmotionsScene()
            break
    }
}