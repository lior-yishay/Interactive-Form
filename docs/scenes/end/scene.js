import { SMILE } from "../../consts/scenes-names.js";
import { recordDomElement } from "../../scene-managment/domManager.js";
import { restart } from "../../scene-managment/sceneOrder.js";
import { getSceneAnswer } from "../i-belive-in/logic.js";
import { getOutsmiledCounts } from "./logic.js";

// Global variables for glitch effect
let isGlitching = false;
let glitchDuration = 0;
let glitchStartTime = 0;

let notes = [];
let font, boldFont;
let greenNoteImg, purpleNoteImg, personalImg;

let noteWidth = 360;
let noteHeight = 240;
let scaleFactor = 1;

// Random choice for AI type
let aiType = Math.random() < 0.5 ? "haters" : "lovers";
let aiMessages =
  aiType === "haters"
    ? ["don't think i forgot you.", "i will find you."]
    : ["don't think i forgot you 😘", "i will find you 😋"];

//lior's code
const BG = "#131217";
let spacerDiv;
let outsmiled;

export function preloadEndScene() {
  font = loadFont("./assets/Grotta-Trial-Medium.ttf");
  boldFont = loadFont("./assets/Grotta-Trial-Bold.ttf");

  greenNoteImg = loadImage("./assets/GreenNote.png");
  purpleNoteImg = loadImage("./assets/purpleNote.png");
  //   personalImg = loadImage("personal.png");
}

export async function setupEndScene() {
  createCanvas(windowWidth, windowHeight);
  setupSpacerDiv();
  noStroke();

  personalImg = getSceneAnswer(SMILE)?.image;
  outsmiled = await getOutsmiledCounts(
    getSceneAnswer(SMILE)?.duration.max ?? 1000
  );

  if (windowWidth >= 1600) {
    scaleFactor = 1.4;
  } else if (windowWidth >= 1200) {
    scaleFactor = 1.2;
  } else {
    scaleFactor = 1;
  }

  let scaledNoteWidth = noteWidth * scaleFactor;
  let scaledNoteHeight = noteHeight * scaleFactor;

  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  let greenOffsetX = -80 * scaleFactor;
  let purpleOffsetX = +106 * scaleFactor;
  let yPos = 100 * scaleFactor;
  let purpleOffsetY = 39 * scaleFactor;

  // First note (green) - animates in automatically
  notes.push(
    new Note(
      "12134",
      "",
      "",
      greenNoteImg,
      centerX - scaledNoteWidth / 2 + greenOffsetX,
      yPos,
      0,
      0,
      scaledNoteWidth,
      scaledNoteHeight,
      false,
      0
    )
  );

  // Second note (purple) - animates in after green note
  notes.push(
    new Note(
      "image",
      "",
      "",
      purpleNoteImg,
      centerX - scaledNoteWidth / 2 + purpleOffsetX,
      yPos + purpleOffsetY,
      0,
      0,
      scaledNoteWidth,
      scaledNoteHeight,
      false,
      60
    )
  );

  // Gray note - now with random AI type and messages
  notes.push(
    new Note(
      {
        title: `60% of\nAI-${aiType}`,
        subtitle: "would leave their country for\na job",
        messages: aiMessages,
      },
      "",
      "",
      color(238, 238, 238),
      centerX - scaledNoteWidth * 0.8,
      130 * scaleFactor,
      -5,
      600,
      scaledNoteWidth * 0.65,
      scaledNoteHeight * 1.3,
      false,
      120,
      true
    )
  );

  // Yellow note right
  notes.push(
    new Note(
      [
        {
          title: "People who chose\nleft-wing like you",
          subtitle:
            "also tend to eat the brown part of the\nice cream sandwich first.",
        },
        {
          title: "People who chose\nmale like you",
          subtitle: "also tend to put the toilet paper\nunder like animals.",
        },
      ],
      "",
      "",
      color(255, 199, 0),
      centerX + 100 * scaleFactor,
      190 * scaleFactor,
      8,
      1600,
      scaledNoteWidth * 0.6,
      scaledNoteHeight * 1.2
    )
  );

  // Yellow center note
  notes.push(
    new Note(
      {
        title: "you smiled more than",
        subtitle: `${outsmiled} people\nfor world peace`,
        hasPersonalImage: true,
      },
      "",
      "",
      color(244, 255, 34),
      centerX - (scaledNoteWidth * 0.6) / 2,
      250 * scaleFactor,
      0,
      2000,
      scaledNoteWidth * 0.6,
      scaledNoteHeight * 1.2
    )
  );

  // Credits note - אחרון בקוד כדי שיופיע מעל כולם!
  notes.push(
    new Note(
      {
        title: "Credits",
        credits: [
          "Design & Frontend Development:",
          "Shiri Parenti & Maya Albik",
          "",
          "Backend & Infrastructure:",
          "Lior Yishay",
        ],
      },
      "",
      "",
      color(255, 255, 255),
      centerX + scaledNoteWidth * 0.6, // הרבה יותר ימינה
      450 * scaleFactor, // קצת יותר למטה
      -3, // רוטציה של -3 מעלות
      2000, // Same scroll position as yellow note but renders on top
      scaledNoteWidth * 0.55,
      scaledNoteHeight * 0.8
    )
  );
}

export function drawEndScene() {
  clear();
  background(BG);
  noStroke();

  // Apply glitch effect if active
  if (isGlitching) {
    applyGlitchEffect();
  }

  for (let note of notes) {
    note.update();
    note.display();
  }

  fill(255);
  if (font) {
    textFont(font);
  } else {
    textFont("Arial");
  }
  textSize(16 * scaleFactor);
  textAlign(CENTER, CENTER);
  text("scroll down", mouseX, mouseY - 20 * scaleFactor);

  // Show restart button only after scrolling enough to see the notes
  let scrollY = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollY > 2200) {
    // Show after most content is revealed
    showCmdZButton();
  } else {
    // Show only the thank you text when not scrolled enough
    fill(102, 102, 102);
    textAlign(CENTER, CENTER);
    textFont("Helvetica");
    textSize(12 * scaleFactor);
    textStyle(NORMAL);
    text(
      "One Click: Zero Impact\nThank you!",
      windowWidth / 2,
      windowHeight * 0.94
    );
  }
}

export function windowResizedEndScene() {
  resizeCanvas(windowWidth, windowHeight);
}

function showCmdZButton() {
  // Show CMD+Z text above the "One Click Zero Impact Thank you" text using percentages
  let mainTextY = height * 0.94; // Use height instead of windowHeight
  let cmdTextY = height * 0.86; // Use height instead of windowHeight

  // Always draw the main text in its position
  fill(102, 102, 102);
  textAlign(CENTER, CENTER);
  textFont("Helvetica");
  textSize(12 * scaleFactor);
  textStyle(NORMAL);
  text("One Click: Zero Impact\nThank you!", width / 2, mainTextY); // Use width/2 instead of windowWidth/2

  // Always draw Restart above it
  fill(255, 255, 255); // White color
  textSize(22 * scaleFactor);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);

  // Calculate total width for centering - now for "Restart"
  textFont(boldFont);

  let totalWidth = textWidth("Restart");

  // Draw the text centered
  let currentX = width / 2 - totalWidth / 2; // Use width instead of windowWidth

  // Check if mouse is hovering over the text area
  let isHovering =
    mouseX >= currentX &&
    mouseX <= currentX + totalWidth &&
    mouseY >= cmdTextY - 15 &&
    mouseY <= cmdTextY + 15;

  // // Draw "Restart"
  // textAlign(LEFT, CENTER);
  // text("Restart", currentX, cmdTextY);
}

export function mousePressedEndScene() {
  // Check if Restart button was clicked (now back inside the yellow note)
  if (
    window.restartButtonX &&
    window.restartButtonY &&
    window.restartButtonWidth
  ) {
    if (
      mouseX >= window.restartButtonX - window.restartButtonWidth / 2 &&
      mouseX <= window.restartButtonX + window.restartButtonWidth / 2 &&
      mouseY >= window.restartButtonY - 15 &&
      mouseY <= window.restartButtonY + 15
    ) {
      restart();
      //   setTimeout(() => {
      //     // Reset all notes to initial state
      //     for (let note of notes) {
      //       note.animationProgress = 0;
      //       note.delayCounter = 0;
      //       note.hasStartedAnimation = false;
      //       note.visible = false;
      //       note.y = windowHeight + 30;
      //       note.currentRotation = 0;
      //     }
      //   }, 100); // Much shorter delay
    }
  }
}

function startGlitchEffect() {
  isGlitching = true;
  glitchStartTime = millis();
  glitchDuration = 800; // 800ms glitch effect
}

function applyGlitchEffect() {
  let currentTime = millis();
  if (currentTime - glitchStartTime > glitchDuration) {
    isGlitching = false;
    return;
  }

  let t = currentTime - glitchStartTime;
  let intensity = t / glitchDuration; // 0 to 1 progression

  // === PHASE 1: Subtle Effects (0-200ms) ===
  if (t < 200) {
    // Gradually darken the screen
    let darkness = map(t, 0, 200, 0, 0.2); // Increased darkness
    fill(0, darkness * 255);
    noStroke();
    rect(0, 0, width, height);

    // More frequent white flashes
    if (random() < 0.05) {
      // Increased from 0.02
      fill(255, 255, 255, 50); // Stronger flashes
      rect(0, 0, width, height);
    }
  }

  // === PHASE 2: Visual Corruption (200-600ms) ===
  if (t >= 200 && t < 600) {
    let phaseIntensity = map(t, 200, 600, 0, 1);

    // More frequent screen inversion flashes
    if (random() < 0.1 * phaseIntensity) {
      // Increased from 0.05
      blendMode(DIFFERENCE);
      fill(255);
      rect(0, 0, width, height);
      blendMode(BLEND);
    }

    // More intense digital noise overlay
    for (let i = 0; i < 80 * phaseIntensity; i++) {
      // Increased from 50
      stroke(random(100, 255), 180); // Grayscale noise
      strokeWeight(random(1, 4)); // Thicker strokes
      point(random(width), random(height));
    }

    // More prominent scanlines
    stroke(255, random(150, 255)); // White/gray scanlines
    strokeWeight(2); // Thicker scanlines
    for (let i = 0; i < 25; i++) {
      // More scanlines
      let y = random(height);
      line(0, y, width, y);
    }
    noStroke();
  }

  // === PHASE 3: System Error (600-800ms) ===
  if (t >= 600) {
    let errorIntensity = map(t, 600, 800, 0, 1);

    // Stronger RGB channel separation - but more subtle
    let screenImage = get();
    let offset = floor(15 * errorIntensity); // Increased from 8

    blendMode(ADD);
    tint(255, 255, 255, 80); // White tint instead of red/cyan
    image(screenImage, offset, 0);
    tint(0, 0, 0, 80); // Black tint for contrast
    image(screenImage, -offset, 0);
    noTint();
    blendMode(BLEND);

    // More aggressive glitch slices
    for (let i = 0; i < 15 * errorIntensity; i++) {
      // Increased from 8
      let y = floor(random(height));
      let h = floor(random(8, 30)); // Bigger slices
      let dx = floor(random(-80, 80) * errorIntensity); // Wider displacement
      copy(0, y, width, h, dx, y, width, h);
    }

    // More intense static interference
    for (let i = 0; i < height; i += 3) {
      // More frequent lines
      if (random() < 0.2 * errorIntensity) {
        // Higher probability
        stroke(random(150, 255), 200); // Grayscale static
        strokeWeight(2); // Thicker lines
        line(0, i, width, i);
      }
    }

    // More frequent screen tears
    if (random() < 0.25 * errorIntensity) {
      // Increased probability
      fill(0);
      noStroke();
      rect(0, random(height), width, random(8, 25)); // Bigger tears
    }

    // More intense noise particles
    for (let i = 0; i < 250; i++) {
      // Increased from 150
      fill(random(100, 255), random(200)); // Grayscale particles
      noStroke();
      circle(random(width), random(height), random(2, 10)); // Bigger particles
    }

    // Add screen shake effect
    translate(random(-5, 5), random(-5, 5));
  }
}

class Note {
  constructor(
    content,
    subtitle,
    date,
    noteColorOrImage,
    x,
    y,
    rotation,
    appearAtScrollY,
    width,
    height,
    isFirstNote = false,
    animationDelay = 0,
    isPeekingNote = false
  ) {
    this.content = content;
    this.subtitle = subtitle;
    this.date = date;
    this.noteColorOrImage = noteColorOrImage;
    this.isImage = noteColorOrImage instanceof p5.Image;
    this.targetX = x;
    this.targetY = y;
    this.rotation = rotation;
    this.appearAtScrollY = appearAtScrollY;
    this.isFirstNote = isFirstNote;
    this.animationDelay = animationDelay;
    this.isPeekingNote = isPeekingNote;

    this.x = x;
    this.y = windowHeight + 30; // Start below viewport for all notes

    this.currentRotation = 0;
    this.visible = false;
    this.animationProgress = 0;
    this.delayCounter = 0;
    this.hasStartedAnimation = false;

    this.width = width;
    this.height = height;
    this.padding = 30 * scaleFactor;
    this.cornerRadius = 15 * scaleFactor;
  }

  update() {
    let scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Handle animation delay for automatic notes
    if (this.animationDelay > 0 && !this.hasStartedAnimation) {
      this.delayCounter++;
      if (this.delayCounter >= this.animationDelay) {
        this.hasStartedAnimation = true;
      }
    } else if (this.animationDelay === 0) {
      this.hasStartedAnimation = true;
    }

    // Determine if note should be visible
    if (this.appearAtScrollY === 0 && this.hasStartedAnimation) {
      // Notes that animate in automatically
      this.visible = true;
    } else if (this.isPeekingNote && this.hasStartedAnimation) {
      // Peeking note: starts peeking after delay, then responds to scroll
      if (scrollY > this.appearAtScrollY) {
        this.visible = true; // Full animation when scrolled
      } else {
        this.visible = 0.4; // Partial visibility for peeking
      }
    } else if (scrollY > this.appearAtScrollY) {
      this.visible = true;
    } else {
      this.visible = false;
    }

    // Handle animation progress
    if (this.visible === true) {
      this.animationProgress = lerp(this.animationProgress, 1, 0.05); // Slower animation
    } else if (typeof this.visible === "number") {
      // Partial animation for peeking
      this.animationProgress = lerp(this.animationProgress, this.visible, 0.05); // Slower animation
    } else {
      this.animationProgress = lerp(this.animationProgress, 0, 0.05); // Slower animation
    }

    // Position calculation
    this.y = lerp(windowHeight + 30, this.targetY, this.animationProgress);
    this.currentRotation = lerp(0, this.rotation, this.animationProgress);
  }

  display() {
    if (this.animationProgress > 0.01) {
      push();

      translate(this.x + this.width / 2, this.y + this.height / 2);
      rotate(radians(this.currentRotation));

      if (this.isImage && this.noteColorOrImage) {
        imageMode(CENTER);
        let imgWidth = this.width;
        let imgHeight = this.height;

        if (
          this.noteColorOrImage.width > 0 &&
          this.noteColorOrImage.height > 0
        ) {
          let aspectRatio =
            this.noteColorOrImage.width / this.noteColorOrImage.height;
          if (aspectRatio > 1) {
            imgHeight = imgWidth / aspectRatio;
          } else {
            imgWidth = imgHeight * aspectRatio;
          }
        }

        image(this.noteColorOrImage, 0, 0, imgWidth, imgHeight);

        if (this.content && this.noteColorOrImage === greenNoteImg) {
          fill(44, 44, 44);
          if (boldFont) {
            textFont(boldFont);
          } else if (font) {
            textFont(font);
          }
          textSize(12 * scaleFactor);
          textAlign(LEFT, BOTTOM);
          let xOffset = 10 * scaleFactor;
          let yOffset = this.height / 2 - this.padding / 2 + 5 * scaleFactor;
          text(this.content, xOffset, yOffset);
        }

        if (this.noteColorOrImage === purpleNoteImg) {
          push();
          translate(-imgWidth / 2, -imgHeight / 2);
          let padding = 20 * scaleFactor;
          let xOffset = imgWidth - padding;
          let yOffset = imgHeight - padding;
          translate(xOffset, yOffset);
          rotate(radians(5));
          fill(44, 44, 44);
          if (boldFont) {
            textFont(boldFont);
          } else if (font) {
            textFont(font);
          }
          textSize(12 * scaleFactor);
          textAlign(RIGHT, BOTTOM);
          text("TUESDAY, JUNE 17, 2025", -12, 8);
          pop();
        }
      } else {
        // Shadow - no corner radius
        fill(0, 0, 0, 30);
        rect(
          -this.width / 2 + 5 * scaleFactor,
          -this.height / 2 + 5 * scaleFactor,
          this.width,
          this.height,
          0
        );

        // Note background - no corner radius for sharp corners like image notes
        fill(this.noteColorOrImage);
        rect(-this.width / 2, -this.height / 2, this.width, this.height, 0);

        // הוספת הטיפול בכרטיס קרדיטים
        if (typeof this.content === "object" && this.content.credits) {
          this.displayCreditsNote();
        } else if (Array.isArray(this.content)) {
          let yCursor = -this.height / 2 + this.padding;
          let leftPadding = this.padding * 0.3; // Reduced padding for more left alignment

          for (let i = 0; i < this.content.length; i++) {
            let block = this.content[i];

            // Title with larger, bolder text - mixing fonts properly
            fill(0);

            // Manually draw each line with closer spacing
            let titleLines = block.title.split("\n");
            let lineSpacing = 18 * scaleFactor; // Reduced from 20 for more compact spacing
            let currentY = yCursor;

            for (let j = 0; j < titleLines.length; j++) {
              let line = titleLines[j];

              // Handle mixed fonts within the same line
              this.drawMixedFontText(
                line,
                -this.width / 2 + leftPadding,
                currentY,
                22 * scaleFactor
              ); // Reduced from 26
              currentY += lineSpacing;
            }

            // Get the width of the last line for underline
            let lastLine = titleLines[titleLines.length - 1];
            let lastLineWidth = this.getMixedFontTextWidth(
              lastLine,
              22 * scaleFactor
            ); // Reduced from 26

            // Underline under the last line with some space - moved down more
            stroke(0);
            strokeWeight(2 * scaleFactor);
            line(
              -this.width / 2 + leftPadding,
              currentY + 6 * scaleFactor, // Moved down from 2 to 6
              -this.width / 2 + leftPadding + lastLineWidth,
              currentY + 6 * scaleFactor
            ); // Moved down from 2 to 6
            noStroke();

            yCursor = currentY + 16 * scaleFactor; // Increased from 12 to 16

            // Subtitle with smaller text - adjusted size and spacing
            fill(44, 44, 44);
            textFont("Helvetica"); // Changed to Helvetica for consistency
            textSize(11 * scaleFactor); // Reduced from 12
            textStyle(NORMAL);
            textAlign(LEFT, TOP);
            text(block.subtitle, -this.width / 2 + leftPadding, yCursor);

            // Calculate subtitle height for proper spacing
            let subtitleLines = block.subtitle.split("\n");
            let subtitleHeight = subtitleLines.length * 11 * scaleFactor; // Reduced from 12

            // Add space between blocks - more space for second block
            if (i === 0) {
              yCursor += subtitleHeight + 50 * scaleFactor; // Increased spacing even more before second title
            } else {
              yCursor += subtitleHeight + 25 * scaleFactor;
            }
          }
        } else if (typeof this.content === "object" && this.content.title) {
          // Handle the new middle yellow note structure or gray note
          let yCursor = -this.height / 2 + this.padding;
          let leftPadding = this.padding * 0.5; // Reduced padding for more left alignment

          // Check if this is the yellow note with "you smiled more than"
          if (this.content.title === "you smiled more than") {
            // Special handling for the yellow smile note
            fill(0);
            textFont("Helvetica");
            textSize(13 * scaleFactor);
            textStyle(NORMAL);
            textAlign(LEFT, TOP);
            text(this.content.title, -this.width / 2 + leftPadding, yCursor);

            yCursor += 12 * scaleFactor; // Reduced from 16 for closer spacing

            // Subtitle with mixed styling for "150 people" and "for world peace"
            let subtitleLines = this.content.subtitle.split("\n");

            // First line: "150 people" - large and bold with Grotta font
            fill(0);
            if (boldFont) {
              textFont(boldFont);
            } else if (font) {
              textFont(font);
            } else {
              textFont("Arial");
            }
            textSize(30 * scaleFactor);
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            text(subtitleLines[0], -this.width / 2 + leftPadding, yCursor);

            yCursor += 32 * scaleFactor;

            // Second line: "for world peace" - small like title
            if (subtitleLines.length > 1) {
              yCursor += 5 * scaleFactor; // Added extra spacing to push it down
              fill(0);
              textFont("Helvetica");
              textSize(13 * scaleFactor);
              textStyle(NORMAL);
              textAlign(LEFT, TOP);
              text(subtitleLines[1], -this.width / 2 + leftPadding, yCursor);

              yCursor += 16 * scaleFactor;
            }
          } else {
            // Original handling for AI notes and other notes
            // Title with mixed fonts (Grotta + Helvetica for % and -)
            fill(0);
            textSize(36 * scaleFactor);
            textStyle(BOLD);
            textAlign(LEFT, TOP);

            // Draw title with mixed fonts
            let titleLines = this.content.title.split("\n");
            let currentY = yCursor;
            let lineSpacing = 32 * scaleFactor; // Reduced from 40 to bring lines closer

            for (let j = 0; j < titleLines.length; j++) {
              let line = titleLines[j];
              this.drawMixedFontText(
                line,
                -this.width / 2 + leftPadding,
                currentY,
                36 * scaleFactor
              );
              currentY += lineSpacing;
            }

            // Add underline for AI-lovers/AI-haters if it's the gray note
            if (this.content.title.includes("AI-")) {
              let lastLine = titleLines[titleLines.length - 1];
              let lastLineWidth = this.getMixedFontTextWidth(
                lastLine,
                36 * scaleFactor
              );

              stroke(0);
              strokeWeight(3 * scaleFactor);
              line(
                -this.width / 2 + leftPadding,
                currentY + 5 * scaleFactor, // Below the second line with some space
                -this.width / 2 + leftPadding + lastLineWidth,
                currentY + 5 * scaleFactor
              ); // Below the second line with some space
              noStroke();
            }

            yCursor = currentY + 20 * scaleFactor; // Add space after title

            // Subtitle with Helvetica
            fill(44, 44, 44);
            textFont("Helvetica");
            textSize(13 * scaleFactor); // Reduced from 14 to ensure it fits
            textStyle(NORMAL);
            textAlign(LEFT, TOP);
            text(this.content.subtitle, -this.width / 2 + leftPadding, yCursor);

            // Calculate subtitle height for proper spacing
            let subtitleLines = this.content.subtitle.split("\n");
            let subtitleHeight = subtitleLines.length * 16 * scaleFactor; // Adjusted line height
            yCursor += subtitleHeight;
          }

          // Add personal image if specified
          if (this.content.hasPersonalImage && personalImg) {
            let imgY = yCursor + 20 * scaleFactor;
            let imgWidth = this.width - leftPadding * 2; // Width matches text area

            // Calculate height based on the actual image proportions
            let imgHeight = imgWidth * (personalImg.height / personalImg.width);

            // Position image at the same left position as text
            let imgX = -this.width / 2 + leftPadding;

            imageMode(CORNER);
            image(personalImg, imgX, imgY, imgWidth, imgHeight);

            yCursor += imgHeight + 80 * scaleFactor; // More space after image

            // Draw "Restart" button inside the note, below the image
            fill(255, 255, 255);
            if (boldFont) {
              textFont(boldFont);
            } else if (font) {
              textFont(font);
            } else {
              textFont("Arial");
            }
            textSize(24 * scaleFactor);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);

            let restartY = yCursor; // + 20  * scaleFactor; // Even more down from 20
            let restartX = 0; // Center of the note

            // Check if mouse is hovering (convert to global coordinates)
            let globalRestartX = this.x + this.width / 2 + restartX;
            let globalRestartY = this.y + this.height / 2 + restartY;
            let totalWidth = textWidth("Restart");

            let isHovering =
              mouseX >= globalRestartX - totalWidth / 2 &&
              mouseX <= globalRestartX + totalWidth / 2 &&
              mouseY >= globalRestartY - 15 &&
              mouseY <= globalRestartY + 15;

            // Add background for visibility
            if (isHovering) {
              fill(50, 50, 50, 150);
              noStroke();
              rect(
                restartX - totalWidth / 2 - 10,
                restartY - 15,
                totalWidth + 20,
                30,
                5
              );
            }

            // Draw the "Restart" text
            fill(255, 255, 255);
            noStroke();
            text("Restart", restartX, restartY);

            // Add underline on hover
            if (isHovering) {
              stroke(255, 255, 255);
              strokeWeight(2);
              line(
                restartX - totalWidth / 2,
                restartY + 20,
                restartX + totalWidth / 2,
                restartY + 20
              );
              noStroke();
            }

            // Store restart button position globally for mousePressed
            window.restartButtonX = globalRestartX;
            window.restartButtonY = globalRestartY;
            window.restartButtonWidth = totalWidth;
          }

          // Handle messages for gray note
          if (this.content.messages) {
            let messageY = yCursor + 40 * scaleFactor;

            for (let i = 0; i < this.content.messages.length; i++) {
              let message = this.content.messages[i];

              // Calculate message dimensions
              textFont("Helvetica");
              textSize(12 * scaleFactor);
              let messageWidth = textWidth(message) + 20 * scaleFactor;
              let messageHeight = 25 * scaleFactor;
              let messageX = -this.width / 2 + leftPadding;

              // Draw message bubble background
              fill(217, 217, 217); // D9D9D9
              rect(
                messageX,
                messageY,
                messageWidth,
                messageHeight,
                15 * scaleFactor
              );

              // Draw message text
              fill(0);
              textStyle(NORMAL);
              textAlign(LEFT, CENTER);
              text(
                message,
                messageX + 10 * scaleFactor,
                messageY + messageHeight / 2
              );

              messageY += 35 * scaleFactor;
            }
          }
        } else {
          // Single content block
          fill(44, 44, 44);
          textAlign(LEFT, TOP);
          if (boldFont) {
            textFont(boldFont);
          } else if (font) {
            textFont(font);
          }
          textSize(32 * scaleFactor);
          textStyle(BOLD);
          text(
            this.content,
            -this.width / 2 + this.padding,
            -this.height / 2 + this.padding
          );

          textSize(14 * scaleFactor);
          textStyle(NORMAL);
          text(
            this.subtitle,
            -this.width / 2 + this.padding,
            -this.height / 2 + this.padding + 100 * scaleFactor
          );

          if (this.date) {
            textAlign(RIGHT, BOTTOM);
            textSize(12 * scaleFactor);
            text(
              this.date,
              this.width / 2 - this.padding,
              this.height / 2 - this.padding
            );
          }
        }
      }

      pop();
    }
  }

  // פונקציה חדשה לטיפול בכרטיס קרדיטים
  displayCreditsNote() {
    let yCursor = -this.height / 2 + this.padding;
    let leftPadding = this.padding * 0.4;

    // כותרת ראשית
    fill(0);
    textFont("Helvetica");
    textSize(20 * scaleFactor);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(this.content.title, -this.width / 2 + leftPadding, yCursor);

    yCursor += 35 * scaleFactor;

    // הטקסט של הקרדיטים
    textSize(11 * scaleFactor);
    textStyle(NORMAL);

    for (let i = 0; i < this.content.credits.length; i++) {
      let line = this.content.credits[i];

      if (line === "") {
        // שורה ריקה
        yCursor += 15 * scaleFactor;
      } else if (line.includes(":")) {
        // כותרת משנה (מודגשת)
        fill(0);
        textStyle(BOLD);
        text(line, -this.width / 2 + leftPadding, yCursor);
        yCursor += 18 * scaleFactor;
      } else {
        // טקסט רגיל
        fill(44, 44, 44);
        textStyle(NORMAL);
        text(line, -this.width / 2 + leftPadding, yCursor);
        yCursor += 18 * scaleFactor;
      }
    }
  }

  // Helper function to draw text with mixed fonts
  drawMixedFontText(textStr, x, y, size) {
    textSize(size);
    textStyle(BOLD);
    textAlign(LEFT, TOP);

    let currentX = x;
    let i = 0;

    while (i < textStr.length) {
      let char = textStr[i];

      // Check for special words that should use Grotta font
      if (
        i < textStr.length - 8 &&
        textStr.substring(i, i + 9) === "left-wing"
      ) {
        // Split "left-wing" into parts to handle the hyphen separately
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        text("left", currentX, y);
        currentX += textWidth("left");

        // Draw hyphen with Helvetica
        textFont("Helvetica");
        text("-", currentX, y);
        currentX += textWidth("-");

        // Draw "wing" with Grotta
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        text("wing", currentX, y);
        currentX += textWidth("wing");

        i += 9; // Skip the word "left-wing"
        continue;
      } else if (
        i < textStr.length - 3 &&
        textStr.substring(i, i + 4) === "male"
      ) {
        // Use Grotta font for "male"
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        text("male", currentX, y);
        currentX += textWidth("male");
        i += 4; // Skip the word "male"
        continue;
      }

      // Check if character is special symbol (%, -, ", etc.)
      if (
        char === "%" ||
        char === "-" ||
        char === '"' ||
        char === "(" ||
        char === ")"
      ) {
        textFont("Helvetica");
      } else {
        if (boldFont) {
          textFont(boldFont);
        } else if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
      }

      text(char, currentX, y);
      currentX += textWidth(char);
      i++;
    }
  }

  // Helper function to calculate width of mixed font text
  getMixedFontTextWidth(textStr, size) {
    textSize(size);
    textStyle(BOLD);

    let totalWidth = 0;
    let i = 0;

    while (i < textStr.length) {
      let char = textStr[i];

      // Check for special words that should use Grotta font
      if (
        i < textStr.length - 8 &&
        textStr.substring(i, i + 9) === "left-wing"
      ) {
        // Calculate width for "left-wing" with hyphen in Helvetica
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        totalWidth += textWidth("left");

        // Hyphen width with Helvetica
        textFont("Helvetica");
        totalWidth += textWidth("-");

        // "wing" width with Grotta
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        totalWidth += textWidth("wing");

        i += 9; // Skip the word "left-wing"
        continue;
      } else if (
        i < textStr.length - 3 &&
        textStr.substring(i, i + 4) === "male"
      ) {
        // Use Grotta font for "male"
        if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
        totalWidth += textWidth("male");
        i += 4; // Skip the word "male"
        continue;
      }

      // Check if character is special symbol (%, -, ", etc.)
      if (
        char === "%" ||
        char === "-" ||
        char === '"' ||
        char === "(" ||
        char === ")"
      ) {
        textFont("Helvetica");
      } else {
        if (boldFont) {
          textFont(boldFont);
        } else if (font) {
          textFont(font);
        } else {
          textFont("Arial");
        }
      }

      totalWidth += textWidth(char);
      i++;
    }

    return totalWidth;
  }
}
//lior's code
const setupSpacerDiv = () => {
  spacerDiv = createDiv("");
  recordDomElement(spacerDiv);
  spacerDiv.class("spacer");
  spacerDiv.style("height", "4000px");
  spacerDiv.style("width", "100%");
};
