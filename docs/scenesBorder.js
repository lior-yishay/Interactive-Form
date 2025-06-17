import { get, post } from "./api/axios.js"
import { isNextBtnDisabled } from "./nextBtnLogic.js"
import { USER_NUMBER } from "./scenes-names.js"
import { AGE, AI, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js"
import { getCurrentScene } from "./sketch.js"


const padding = 5
let navbarHeight, 
    nextButton = {
        x: undefined,
        y: undefined,
        h: undefined,
        w: undefined,
    },
    userNumber
export const setupBoarder = async () => {
    userNumber = (await post(USER_NUMBER)).value
    navbarHeight = height / 20
    nextButton.w = width/12
    nextButton.h = navbarHeight * 5/8
    nextButton.y = height - ((navbarHeight + nextButton.h) / 2)
    nextButton.x = width - nextButton.w - (navbarHeight - nextButton.h)
    textFont('Helvetica Neue, Arial, sans-serif');
}

// Shared navbar
export const drawNavbar = () => {
  fill(255);
  rect(0, 0, width, navbarHeight );
  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER)
  textFont("Calibri")
  text('\tIts Obvious', padding, navbarHeight /2);
  drawUserNumber()
}

// Shared footer
export const drawFooter = () => {
  fill(255);
  rect(0, height - navbarHeight , width, navbarHeight );
  fill(0);
  textSize(22);
  textAlign(CENTER, CENTER)
  textFont("Calibri")
  text(footerText[getCurrentScene()], width /2 , height - navbarHeight /2);
}

export const drawNextButton = () => {
  const { x, y, w, h } = nextButton;

  if (isNextBtnDisabled()) {
    fill(0, 13, 38, 50); 
    cursor(ARROW);
  } else if (mouseOnNextBtn()) {
    fill(10, 45, 90); 
    cursor(HAND);    
  } else {
    fill(0, 13, 38); 
    cursor(ARROW);
  }

  // Draw the button rectangle
  rect(x, y, w, h, 100); // rounded corners

  // Draw the text
  fill(isNextBtnDisabled() ? 241 : 255);
  textSize(22)
  textAlign(CENTER, CENTER);
  textFont("Calibri")
  text("NEXT", x + w / 2, y + h / 2);
};

export const mouseOnNextBtn = () => {
  const { x, y, w, h } = nextButton;

  return mouseX >= x && mouseX <= x + w &&
            mouseY >= y && mouseY <= y + h;
}

const drawUserNumber = () => {
  textSize(16)
  textAlign(CENTER, CENTER)
  textFont("Calibri")
  text(`Participant\t#${userNumber}`, width/2, navbarHeight/2)
}

const footerText = {
    [START]: '?',
    [NAME]: 'Draw Your Name!', 
    [GENDERS]: 'Its Obvious',
    [AGE]: 'Its Obvious',
    [LIVING_HERE]: 'Its Obvious',
    [POLITICS]: 'Its Obvious',
    [ICE_CREAM_SANDWICH]: 'Its Obvious',
    [SMILE]: 'Its Obvious',
    [UNREAL]: 'Its Obvious',
    [I_BELIEVE_IN]: 'Its Obvious',
    [AI]: 'Its Obvious',
}