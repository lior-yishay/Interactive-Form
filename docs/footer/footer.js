import {
  AI,
  BIG_THING,
  BINGO,
  COUNTRY,
  END,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  SMILE_ENDING,
  SMILE_LOADER,
  START,
  THE_ANSWER,
  TOILET,
  UNREAL,
} from "../consts/scenes-names.js";
import { getCurrentUser } from "../currentUser.js";
import { getCurrentScene } from "../scene-managment/sceneOrder.js";
import { isSoundOn } from "../soundManager.js";
import { callIfExsist } from "../utils/callIfExsist.js";
import { drawTextWithSpecialChar } from "../utils/text.js";
import { isNextBtnDisabled } from "./nextBtnLogic.js";

const padding = 5;

const BLACK = 0,
  WHITE = 255;

let footerHeight, footerMiddleH;

let nextButton = {
    x: undefined,
    y: undefined,
    h: undefined,
    w: undefined,
  },
  soundToggleBtn = {
    x: undefined,
    y: undefined,
    h: undefined,
    w: undefined,
  };

let userNumber;
let arrowLength = 10;

let grottaFont;

export const getFooterTop = () => height - footerHeight;

export const preloadFooter = () => {
  grottaFont = loadFont("./assets/Grotta-Trial-Medium.ttf");
};

export const setupFooter = async () => {
  userNumber = await getCurrentUser();

  footerHeight = windowHeight / 20;
  footerMiddleH = windowHeight - footerHeight / 2;

  textSize(22);
  textFont(grottaFont);
  nextButton.w = textWidth("Next") + 40; //extra space for arrow;
  nextButton.h = (footerHeight * 5) / 8;
  nextButton.y = windowHeight - (footerHeight + nextButton.h) / 2;
  nextButton.x = windowWidth - nextButton.w - (footerHeight - nextButton.h);

  textSize(22);
  textFont(grottaFont);
  soundToggleBtn.w = textWidth("Sound ");
  textSize(12);
  textFont(grottaFont);
  soundToggleBtn.w += textWidth("Off");
  soundToggleBtn.h = nextButton.h;
  soundToggleBtn.y = nextButton.y;
  soundToggleBtn.x = windowWidth / 2 - soundToggleBtn.w / 2;
};

// Shared footer
export const drawFooter = () => {
  if (getCurrentScene() === SMILE_LOADER || getCurrentScene() === END) return;

  if (getCurrentScene() === START) {
    drawSoundToggleBtn();
    return;
  }

  stroke(getFooterTextColor());
  noFill();
  strokeWeight(1);
  line(
    0,
    windowHeight - footerHeight,
    windowWidth,
    windowHeight - footerHeight
  );
  noStroke();
  drawPeopleCountAndName();
  drawSoundToggleBtn();
  drawNextButton();

  if (mouseY > getFooterTop()) {
    cursor(
      (!isNextBtnDisabled() && mouseOnNextBtn()) || mouseOnSoundBtn()
        ? "pointer"
        : "default"
    );
  }
};

export const drawNextButton = () => {
  const { x, y, w, h } = nextButton;
  if (!x || !y || !w || !h) return;

  textSize(22);
  const textStr = "Next";
  const textW = textWidth(textStr);

  fill(getFooterTextColor());
  noStroke();
  textAlign(LEFT, CENTER);
  text(textStr, x, y + h / 2);

  if (!isNextBtnDisabled()) {
    // Draw underline
    const underlineY = y + h / 2 + 15;
    stroke(getFooterTextColor());
    noFill();
    strokeWeight(1);
    line(x, underlineY, x + textW, underlineY);

    // Animate arrow
    const targetArrowLength = mouseOnNextBtn() ? 25 : 10;
    arrowLength = lerp(arrowLength, targetArrowLength, 0.1);

    // Draw right arrow
    const arrowX = x + textW + 10;
    const arrowY = y + h / 2 + 3;
    stroke(getFooterTextColor());
    strokeWeight(2);
    noFill();
    line(arrowX, arrowY, arrowX + arrowLength, arrowY); // main line
    line(arrowX + arrowLength - 5, arrowY - 5, arrowX + arrowLength, arrowY); // upper head
    line(arrowX + arrowLength - 5, arrowY + 5, arrowX + arrowLength, arrowY); // lower head
  }
};

export const mouseOnNextBtn = () => {
  const { x, y, w, h } = nextButton;
  if (!x || !y || !w || !h) return false;

  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
};

const drawSoundToggleBtn = () => {
  const { x, y, w, h } = soundToggleBtn;
  if (!x || !y || !w || !h) return;

  textSize(22);
  const soundText = "Sound ";
  const soundW = textWidth(soundText);

  fill(getFooterTextColor());
  noStroke();
  textAlign(LEFT, CENTER);
  text(soundText, x, y + h / 2);

  textSize(12);
  const onOffText = isSoundOn() ? "On" : "Off";
  const onOffW = textWidth(onOffText);

  fill(getFooterTextColor());
  noStroke();
  textAlign(LEFT, CENTER);
  text(onOffText, x + soundW, y + h / 2);

  // Draw underline
  const underlineY = y + h / 2 + 7;
  stroke(getFooterTextColor());
  noFill();
  strokeWeight(1);
  line(x + soundW, underlineY, x + soundW + onOffW, underlineY);
};

export const mouseOnSoundBtn = () => {
  const { x, y, w, h } = soundToggleBtn;
  if (!x || !y || !w || !h) return false;

  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
};

const drawPeopleCountAndName = () => {
  textAlign(LEFT, CENTER);
  textFont(grottaFont);
  fill(getFooterTextColor());
  drawTextWithSpecialChar(
    `\t${userNumber} People : 1 Click : 0 Impact`,
    ":",
    grottaFont ?? "Helvetica",
    "Helvetica",
    22,
    padding,
    footerMiddleH
  );
};

const footerTextColor = {
  [START]: () => WHITE,
  [NAME]: () => BLACK,
  [GENDERS]: () => (isNextBtnDisabled() ? BLACK : WHITE),
  [COUNTRY]: () => BLACK,
  [POLITICS]: () => WHITE,
  [ICE_CREAM_SANDWICH]: () => BLACK,
  [SMILE_LOADER]: () => WHITE,
  [SMILE]: () => WHITE,
  [SMILE_ENDING]: () => WHITE,
  [UNREAL]: () => BLACK,
  [I_BELIEVE_IN]: () => WHITE,
  [AI]: () => BLACK,
  [BIG_THING]: () => WHITE,
  [TOILET]: () => BLACK,
  [THE_ANSWER]: () => WHITE,
  [BINGO]: () => WHITE,
};

const getFooterTextColor = () =>
  callIfExsist(footerTextColor[getCurrentScene()]) ?? WHITE;
