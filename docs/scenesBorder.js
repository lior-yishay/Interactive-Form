import { get, post } from "./api/axios.js"
import { USER_NUMBER } from "./scenes-names.js"

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
    nextButton.w = width/10
    nextButton.h = navbarHeight * 2/3
    nextButton.y = height - ((navbarHeight + nextButton.h) / 2)
    nextButton.x = width - nextButton.w - (navbarHeight - nextButton.h)/2
    textFont('Helvetica Neue, Arial, sans-serif');
}

// Shared navbar
export const drawNavbar = () => {
  fill(255);
  rect(0, 0, width, navbarHeight );
  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER)
  text("My Navbar", padding, navbarHeight /2);
  drawUserNumber()
}

// Shared footer
export const drawFooter = () => {
  fill(255);
  rect(0, height - navbarHeight , width, navbarHeight );
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER)
  text("My Footer", padding, height - navbarHeight /2);
}

export const drawNextButton = () => {
  const { x, y, w, h } = nextButton;


  // Optional: change color on hover
  if (mouseOnNextBtn()) {
    fill(0, 30, 80); // hover color
    cursor(HAND);    // change cursor to pointer
  } else {
    fill(0, 13, 38); // normal color
    cursor(ARROW);
  }

  // Draw the button rectangle
  rect(x, y, w, h, 10); // rounded corners

  // Draw the text
  fill(255);
  textAlign(CENTER, CENTER);
  text("Next", x + w / 2, y + h / 2);
};

export const mouseOnNextBtn = () => {
  const { x, y, w, h } = nextButton;

  return mouseX >= x && mouseX <= x + w &&
            mouseY >= y && mouseY <= y + h;
}

const drawUserNumber = () => {
  textSize(16)
  textAlign(CENTER, CENTER)
  text(`user #${userNumber}`, width/2, navbarHeight/2)
}