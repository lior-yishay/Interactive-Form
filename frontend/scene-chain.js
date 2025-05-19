import { SMILE, GENDERS } from "./scenes-names.js";
import { setupSmileScene } from "./scenes/smile/sketch.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => {
    switch(getCurrentScene()){
        case GENDERS: 
            setCurrentScene(SMILE)
            setupSmileScene()
            break
    }
}