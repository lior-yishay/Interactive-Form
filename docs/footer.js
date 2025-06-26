import { get, post } from "./api/axios.js";
import { isNextBtnDisabled } from "./nextBtnLogic.js";
import { USER_NUMBER } from "./scenes-names.js";
import {
  AGE,
  AI,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  COUNTRY,
  NAME,
  POLITICS,
  SMILE,
  START,
  UNREAL,
} from "./scenes-names.js";
import { getCurrentScene } from "./sketch.js";

const padding = 5;
let footerHeight,
  nextButton = {
    x: undefined,
    y: undefined,
    h: undefined,
    w: undefined,
  },
  userNumber;
let footerMiddleH;

let arrowLength = 10;

const BLACK = 0,
  WHITE = 255;

export const getFooterTop = () => height - footerHeight;

export const setupFooter = async () => {
  userNumber = (await post(USER_NUMBER)).value;
  footerHeight = windowHeight / 20;
  footerMiddleH = windowHeight - footerHeight / 2;

  textSize(22);
  textFont("Calibri");
  nextButton.w = textWidth("Next") + 40; //extra space for arrow;
  nextButton.h = (footerHeight * 5) / 8;
  nextButton.y = windowHeight - (footerHeight + nextButton.h) / 2;
  nextButton.x = windowWidth - nextButton.w - (footerHeight - nextButton.h);
};

// Shared footer
export const drawFooter = () => {
  stroke(getFooterTextColor());
  noFill();
  strokeWeight(1);
  line(0, height - footerHeight, width, height - footerHeight);
  noStroke();
  drawPeopleCountAndName();
  drawSoundOnOff();
  drawNextButton();
};

export const drawNextButton = () => {
  const { x, y, w, h } = nextButton;

  const textStr = "Next";
  const textW = textWidth(textStr);

  fill(getFooterTextColor());
  noStroke();
  textAlign(LEFT, CENTER);
  text(textStr, x, y + h / 2);

  if (!isNextBtnDisabled()) {
    // Draw underline
    const underlineY = y + h / 2 + 10;
    stroke(getFooterTextColor());
    noFill();
    strokeWeight(1);
    line(x, underlineY, x + textW, underlineY);

    // Animate arrow
    const targetArrowLength = mouseOnNextBtn() ? 25 : 10;
    arrowLength = lerp(arrowLength, targetArrowLength, 0.1);

    // Draw right arrow
    const arrowX = x + textW + 10;
    const arrowY = y + h / 2;
    stroke(getFooterTextColor());
    strokeWeight(2);
    noFill();
    line(arrowX, arrowY, arrowX + arrowLength, arrowY); // main line
    line(arrowX + arrowLength - 5, arrowY - 5, arrowX + arrowLength, arrowY); // upper head
    line(arrowX + arrowLength - 5, arrowY + 5, arrowX + arrowLength, arrowY); // lower head
  }

  cursor(!isNextBtnDisabled() && mouseOnNextBtn() ? "pointer" : "default");
};

export const mouseOnNextBtn = () => {
  const { x, y, w, h } = nextButton;

  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
};

const drawPeopleCountAndName = () => {
  textSize(22);
  textAlign(LEFT, CENTER);
  textFont("Calibri");
  fill(getFooterTextColor());
  text(`\t${userNumber} People : 1 Click : 0 Impact`, padding, footerMiddleH);
};

const drawSoundOnOff = () => {};

export const mouseOnSoundBtn = () => {};

const footerTextColor = {
  [START]: () => BLACK,
  [NAME]: () => BLACK,
  [GENDERS]: () => (isNextBtnDisabled() ? BLACK : WHITE),
  [COUNTRY]: () => BLACK,
  [POLITICS]: () => WHITE,
  [ICE_CREAM_SANDWICH]: () => WHITE,
  [SMILE]: () => WHITE,
  [UNREAL]: () => BLACK,
  [I_BELIEVE_IN]: () => WHITE,
  [AI]: () => BLACK,
};

const getFooterTextColor = () => footerTextColor[getCurrentScene()]();
