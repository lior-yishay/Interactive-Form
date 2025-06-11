const padding = 5
let navbarHeight, 
    nextButton = {
        x: undefined,
        y: undefined,
        h: undefined,
        w: undefined,
    }

export const setupBoarder = () => {
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
    fill(0, 13, 38)
    rect(nextButton.x, nextButton.y, nextButton.w, nextButton.h)
    fill(255)
    textAlign(CENTER, CENTER)
    text("Next", nextButton.x + nextButton.w/2, nextButton.y + nextButton.h/2)
}