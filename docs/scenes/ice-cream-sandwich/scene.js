import { getIceCreamSandwichCounts } from "./logic.js";

let userPick = null;
const VANILA = "vanila",
  CHOCOLATE = "chocolate";

let skyBg;
let whitePart, brownPart;

let hasClicked = false;
let isHoveringWhite = false;
let isHoveringBrown = false;

let tvShutDownSound;
let clickButtonSound;
let radioStaticSound;
let happyTuneSound;

let bafiring = false;
let bafiringStartTime = 0;
let bafiringDuration = 90; // milliseconds

let tvIsOn = false;
let tvTurningOn = false;
let tvTurnOnStart = 0;
let contentAlpha = 0; // instead of 255

let overshootAmount = 10;
let overshooting = false;
let recoveringFromOvershoot = false;

let overshootEasing = 0.25; // Fast growth
let normalEasing = 0.08; // Smooth return

let whiteFillWidth = 292;
let brownFillWidth = 238;
let targetWhiteWidth = 292;
let targetBrownWidth = 238;

let whiteFillingClicks = 0;
let brownFillingClicks = 0;

let minVisualWidth = 20;
let easing = 0.1;

let whiteFillingHeightRatio = 0.55;
let whiteFillingYOffsetRatio = 0.346;
let whiteFillingXOffset = 75;

let brownFillingHeightRatio = 0.55;
let brownFillingYOffsetRatio = 0.346;
let brownFillingXOffset = 266;

let whiteImageOffsetX = 67;
let whiteImageOffsetY = 69;
let brownImageOffsetX = -1.5;
let brownImageOffsetY = 18.59;

const whiteW = 500 / 1.6,
  whiteH = 350 / 1.6;
const brownW = 500 / 1.6,
  brownH = 350 / 1.6;

let whiteDrag = { x: 0, y: 0 };
let brownDrag = { x: 0, y: 0 };

let skyDrawX = 0,
  skyDrawY = 0,
  skyDrawW = 0,
  skyDrawH = 0;

let casataRotation = -0.2;
let casataScaleFactor = 1.25;

let fontGrotta;
let fontSnell;
let fontHelvetica;

let skyStroke;

export function preloadIceCreamSandwichScene() {
  skyBg = loadImage("./assets/sky.png");
  whitePart = loadImage("./assets/White2.png");
  brownPart = loadImage("./assets/Brown2.png");
  skyStroke = loadImage("./assets/stroke.png");

  fontGrotta = loadFont("./assets/Grotta-Trial-Bold.ttf");
  fontSnell = loadFont("./assets/SnellRoundhand-BlackScript.otf");

  tvShutDownSound = loadSound("./assets/tv-shut-down-185446.mp3");
  clickButtonSound = loadSound("./assets/click-button-166324.mp3");
  radioStaticSound = loadSound("./assets/radio-static-6382.mp3");
  happyTuneSound = loadSound("./assets/happy-tune-29317.mp3");
}

export async function setupIceCreamSandwichScene() {
  createCanvas(windowWidth, windowHeight);
  let flavorsCount = await getIceCreamSandwichCounts();
  whiteFillingClicks = flavorsCount.vanila;
  brownFillingClicks = flavorsCount.chocolate;
}

export function windowResizedIceCreamSandwichScene() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawWithRGBBleed(drawFn) {
  push();
  tint(255, 0, 0, 120); // Red bleed
  translate(1.5, 0); // Shift right
  drawFn();
  pop();

  push();
  tint(0, 0, 255, 120); // Blue bleed
  translate(-1.5, 0); // Shift left
  drawFn();
  pop();

  drawFn(); // Normal drawing
}

export function drawIceCreamSandwichScene() {
  background(0);

  let paddingTop = 60;
  let paddingBottom = 20;
  let paddingLeft = 100;
  let paddingRight = 300;

  let maxSkyW = width - paddingLeft - paddingRight;
  let maxSkyH = height - paddingTop - paddingBottom;
  let aspect = skyBg.width / skyBg.height;

  skyDrawW = maxSkyW;
  skyDrawH = skyDrawW / aspect;

  if (skyDrawH > maxSkyH) {
    skyDrawH = maxSkyH;
    skyDrawW = skyDrawH * aspect;
  }

  skyDrawX = paddingLeft + (maxSkyW - skyDrawW) / 2;
  skyDrawY = paddingTop + (maxSkyH - skyDrawH) / 2;

  // TV TURN-ON ANIMATION
  let showContent = tvIsOn;
  let contentAlpha = 255;

  if (tvTurningOn) {
    let turnOnTime = millis() - tvTurnOnStart;
    let turnOnDuration = 400; // 1.2 second animation

    if (turnOnTime < turnOnDuration) {
      // Still animating
      showContent = true;

      // Phase 1: Thin horizontal line (0-300ms)
      if (turnOnTime < 300) {
        let progress = turnOnTime / 300;
        // Smooth easing for line expansion
        let easedProgress = 1 - Math.pow(1 - progress, 3);
        let lineHeight = lerp(2, skyDrawH, easedProgress);
        let lineY = skyDrawY + (skyDrawH - lineHeight) / 2;

        // Black background covering the entire sky area
        fill(0, 10, 0, 600); // More noticeable but still semi-transparent
        rect(skyDrawX, skyDrawY, skyDrawW, skyDrawH);

        // Bright white line expanding vertically with slight flicker and rounded corners
        let brightness = 255 + sin(turnOnTime * 0.1) * 30;
        fill(brightness / 2);
        // Use rect() with rounded corners (p5.js syntax: rect(x, y, w, h, radius))
        rect(skyDrawX, lineY, skyDrawW, lineHeight, 120);

        showContent = false;
      }
      // Phase 2: Content fades in gradually (300-900ms)
      else if (turnOnTime < 900) {
        let progress = (turnOnTime - 300) / 600;
        let easedProgress = progress * progress * (3 - 2 * progress); // Smooth S-curve

        contentAlpha = lerp(60, 200, easedProgress);

        // Show content with gradual fade-in and glitching
        push();
        tint(contentAlpha * 0.8, contentAlpha * 0.9, contentAlpha); // Slight blue tint initially

        // Add glitching effects during fade-in
        if (progress < 0.8) {
          // Random horizontal displacement glitches
          if (random() < 0.3) {
            let glitchOffset = random(-8, 8) * (1 - progress);
            translate(glitchOffset, 0);
          }

          // Occasional vertical stretching glitch
          if (random() < 0.15) {
            let stretchFactor = 1 + random(-0.1, 0.1) * (1 - progress);
            scale(1, stretchFactor);
          }

          // Color channel separation glitch
          if (random() < 0.2) {
            // Draw red channel slightly offset
            tint(contentAlpha, 0, 0, contentAlpha * 0.5);
            image(
              skyBg,
              skyDrawX + random(-3, 3),
              skyDrawY,
              skyDrawW,
              skyDrawH
            );

            // Draw green channel slightly offset
            tint(0, contentAlpha, 0, contentAlpha * 0.5);
            image(
              skyBg,
              skyDrawX + random(-3, 3),
              skyDrawY,
              skyDrawW,
              skyDrawH
            );

            // Draw blue channel
            tint(0, 0, contentAlpha, contentAlpha * 0.5);
            image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);
          } else {
            image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);
          }
        } else {
          image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);
        }

        pop();
        noTint();

        // Add horizontal static lines during glitch
        if (progress < 0.6 && random() < 0.4) {
          stroke(255, random(50, 150));
          strokeWeight(1);
          for (let i = 0; i < random(3, 8); i++) {
            let lineY = skyDrawY + random(skyDrawH);
            line(skyDrawX, lineY, skyDrawX + skyDrawW, lineY);
          }
          noStroke();
        }

        // Subtle scanning line effect
        if (progress < 0.7) {
          let scanProgress = progress / 0.7;
          let scanY = lerp(skyDrawY, skyDrawY + skyDrawH, scanProgress);
          let scanAlpha = lerp(100, 30, progress);
          fill(255, scanAlpha);
          rect(skyDrawX, scanY - 2, skyDrawW, 4);
        }

        showContent = false; // We're handling content manually
      }
      // Phase 3: Final stabilization (900-1200ms)
      else {
        let progress = (turnOnTime - 900) / 300;
        let easedProgress = progress * progress * (3 - 2 * progress);
        contentAlpha = lerp(200, 255, easedProgress);
        showContent = true;

        // Add slight warmup flicker
        if (progress < 0.8) {
          contentAlpha += sin(turnOnTime * 0.05) * (10 * (1 - progress));
        }
      }
    } else {
      // Animation complete
      tvTurningOn = false;
      showContent = true;
      contentAlpha = 255;
    }
  }

  // DRAW THE TV CONTENT
  if (showContent) {
    if (tvIsOn) {
      if (contentAlpha < 255) {
        tint(contentAlpha, contentAlpha, contentAlpha);
      }
      noStroke();
      image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);
      if (contentAlpha < 255) {
        noTint();
      }
    } else {
      // TV IS OFF - Show scene with smooth fade
      // Apply a subtle fade effect to the entire scene
      tint(120, 120, 120, 180); // Darker, more muted appearance
      noStroke();
      image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);

      // Draw casata elements normally but with the same muted tint
      push();
      translate(casataCenterX, casataCenterY - 10);
      rotate(-casataRotation);
      scale(casataScale);

      // SUN - normal rendering
      push();
      translate(150, 70);

      let sunRadiusX = whiteH * 0.7 * casataScaleFactor;
      let sunRadiusY = whiteH * 0.9 * casataScaleFactor;

      fill(0);
      noStroke();
      ellipse(20, 20, sunRadiusX * 2.8, sunRadiusY * 2.8);

      fill("#FFFF00");
      stroke("#FFFF00");
      strokeWeight(3);
      ellipse(0, 0, sunRadiusX * 2.8, sunRadiusY * 2.8);

      // rotating star rays - normal rendering
      push();
      let starAngle = (millis() / 24000) * TWO_PI;
      rotate(starAngle);
      fill("#FFFFFF");
      stroke("#000000");
      strokeWeight(0.5);
      beginShape();
      for (let i = 0; i < 24; i++) {
        let angle = (TWO_PI / 24) * i;
        let outerRadius = i % 2 === 0 ? sunRadiusX * 1.25 : sunRadiusX * 0.6;
        let x = cos(angle) * outerRadius;
        let y = sin(angle) * outerRadius * (sunRadiusY / sunRadiusX);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
      pop();

      const scaledWhiteW = whiteW;
      const scaledWhiteH = whiteH;
      const scaledBrownW = brownW;
      const scaledBrownH = brownH;

      let localWhiteX = -180 + whiteDrag.x / casataScale;
      let localWhiteY = -100 + whiteDrag.y / casataScale;
      let localBrownX = 180 + brownDrag.x / casataScale;
      let localBrownY = -50 + brownDrag.y / casataScale;

      const whiteFillingHeight = scaledWhiteH * whiteFillingHeightRatio;
      const whiteFillingYOffset = scaledWhiteH * whiteFillingYOffsetRatio;
      const whiteFillingX =
        localWhiteX + whiteImageOffsetX + whiteFillingXOffset;
      const whiteFillingY =
        localWhiteY + whiteImageOffsetY + whiteFillingYOffset;

      // Normal vanilla filling
      fill("#f3e9d9");
      noStroke();
      let maxWhiteWidth = whiteImageOffsetX + whiteFillingXOffset + whiteW;
      let whiteFillRight = whiteFillingX + whiteFillWidth - 26.5;
      let safeWhiteWidth = min(whiteFillRight, maxWhiteWidth) - whiteFillingX;
      rect(whiteFillingX, whiteFillingY, safeWhiteWidth, whiteFillingHeight);

      // Normal white ice cream image
      image(
        whitePart,
        localWhiteX + whiteImageOffsetX,
        localWhiteY + whiteImageOffsetY,
        scaledWhiteW,
        scaledWhiteH
      );

      const brownFillingHeight = scaledBrownH * brownFillingHeightRatio;
      const brownFillingYOffset = scaledBrownH * brownFillingYOffsetRatio;
      const brownFillingRight =
        localBrownX + brownImageOffsetX + brownFillingXOffset;
      const brownFillingY =
        localBrownY + brownImageOffsetY + brownFillingYOffset;
      const brownFillingX = brownFillingRight - brownFillWidth;
      const brownVisualWidth = brownFillWidth + 27.5;

      // Normal chocolate filling
      fill("#bc7567");
      rect(
        brownFillingX,
        brownFillingY,
        brownFillWidth + 27.5,
        brownFillingHeight
      );

      // Normal brown ice cream image
      image(
        brownPart,
        localBrownX + brownImageOffsetX,
        localBrownY + brownImageOffsetY,
        scaledBrownW,
        scaledBrownH
      );

      pop();

      // Reset tint
      noTint();

      // Add a much lighter black screen overlay so elements are visible underneath
      fill(0, 0, 0, 60); // Much lighter - was 140, now 60
      noStroke();
      rect(skyDrawX, skyDrawY, skyDrawW, skyDrawH);

      // Subtle reflection on black screen
      fill(40, 40, 50, 30); // Also lighter - was 56, now 30
      ellipse(
        skyDrawX + skyDrawW * 0.3,
        skyDrawY + skyDrawH * 0.3,
        skyDrawW * 0.4,
        skyDrawH * 0.3
      );
    }
  }

  // Always draw stroke around the sky area
  let strokeMargin = skyDrawW * 0.01;
  if (tvIsOn && contentAlpha < 255) {
    tint(contentAlpha, contentAlpha, contentAlpha);
  }
  image(
    skyStroke,
    skyDrawX - strokeMargin,
    skyDrawY - strokeMargin,
    skyDrawW + strokeMargin * 2,
    skyDrawH + strokeMargin * 2
  );
  if (tvIsOn && contentAlpha < 255) {
    noTint();
  }

  whiteFillWidth = lerp(whiteFillWidth, targetWhiteWidth, easing);
  brownFillWidth = lerp(brownFillWidth, targetBrownWidth, easing);

  let casataScale = skyDrawH * 0.0008 * casataScaleFactor;
  let casataRightEdge = skyDrawX + skyDrawW * 0.75;
  let casataBaseY = skyDrawY + skyDrawH / 2.4;

  let casataCenterX = casataRightEdge - 200 * casataScale;
  let casataCenterY = casataBaseY;

  // Define baseFontSize outside the conditional blocks so it's available everywhere
  let baseFontSize = skyDrawH * 0.16;

  // Only show text when TV is on and not during turn-on animation
  if (tvIsOn && !tvTurningOn) {
    // BAFIRING GLITCH LOGIC - Fixed version
    // Randomly trigger bafiring glitch when not already glitching
    if (!bafiring && random() < 0.0008) {
      // Even less frequent - about once every 15-20 seconds
      bafiring = true;
      bafiringStartTime = millis();
    }

    // Check if bafiring should end
    if (bafiring) {
      let elapsed = millis() - bafiringStartTime;
      if (elapsed < bafiringDuration) {
        drawBafiringGlitch(contentAlpha); // Pass contentAlpha for proper fading
      } else {
        bafiring = false;
      }
    }

    // Apply smooth fade effect to text using the same timing as sky background
    let textAlpha = contentAlpha;

    // Add glitching effects to text during fade-in (but not bafiring)
    if (textAlpha < 255 && !bafiring) {
      push();

      // Random horizontal displacement glitches for text
      if (random() < 0.2) {
        let glitchOffset = random(-4, 4) * ((255 - textAlpha) / 255);
        translate(glitchOffset, 0);
      }

      // Occasional color channel separation for text
      if (random() < 0.15) {
        // Slightly offset red channel
        fill(255, 0, 0, textAlpha * 0.7);
        stroke(0, 0, 0, textAlpha * 0.7);
        strokeWeight(2);
        textAlign(LEFT, TOP);
        let textLeftX = skyDrawX + skyDrawW * 0.06 + random(-2, 2);
        let textTopY = skyDrawY + skyDrawH * 0.06 + random(-1, 1);

        // Draw offset text elements briefly
        textFont(fontGrotta);
        textSize(baseFontSize * 0.6);
        text("WHICH", textLeftX, textTopY);

        pop();
        push();

        // Blue channel
        fill(0, 0, 255, textAlpha * 0.7);
        stroke(0, 0, 0, textAlpha * 0.7);
        strokeWeight(2);
        textAlign(LEFT, TOP);
        textLeftX = skyDrawX + skyDrawW * 0.06 + random(-2, 2);
        textTopY = skyDrawY + skyDrawH * 0.06 + random(-1, 1);

        textFont(fontGrotta);
        textSize(baseFontSize * 0.6);
        text("WHICH", textLeftX, textTopY);
      }

      pop();
    }

    // Only draw normal text if not in bafiring mode
    if (!bafiring && textAlpha > 0) {
      fill(255, 255, 255, textAlpha);
      stroke(0, 0, 0, textAlpha);
      strokeWeight(2);
      textAlign(LEFT, TOP);
      let textLeftX = skyDrawX + skyDrawW * 0.06;
      let textTopY = skyDrawY + skyDrawH * 0.06;

      let whichY = textTopY;
      let firstY = textTopY + baseFontSize * 1.1;

      // ANIMATED "WHICH SIDE FIRST?" SEQUENTIALLY
      let bounceSpeed = 300;
      let bounceHeight = 6;
      let letterSpacing = 50;
      let wordPause = 500;

      // lior's commented this
      // if (typeof animStart === "undefined") {
      //   animStart = millis();
      // }
      // let now = millis() - animStart;

      let now = millis();

      // WHICH
      textStyle(BOLD);
      textFont(fontGrotta);
      textSize(baseFontSize * 0.6);

      let whichStr = "WHICH";
      let whichX = textLeftX;
      let whichStart = 0;
      let whichEnd =
        whichStart + (whichStr.length - 1) * letterSpacing + bounceSpeed;

      // Drop shadow for WHICH
      fill(0, 0, 0, textAlpha * 0.24); // Apply alpha to shadow
      noStroke();
      if (now >= whichStart && now < whichEnd + wordPause) {
        let shadowX = textLeftX;
        for (let i = 0; i < whichStr.length; i++) {
          let ch = whichStr[i];
          let t = (now - whichStart - i * letterSpacing) / bounceSpeed;
          let bounce = sin(t) * bounceHeight * (t > 0 ? 1 : 0);
          text(ch, shadowX + 6, whichY + bounce + 6);
          shadowX += textWidth(ch);
        }
      } else {
        text(whichStr, textLeftX + 6, whichY + 6);
      }

      // Main WHICH text
      fill(255, 255, 255, textAlpha);
      stroke(0, 0, 0, textAlpha);
      strokeWeight(2);
      if (now >= whichStart && now < whichEnd + wordPause) {
        let mainX = textLeftX;
        for (let i = 0; i < whichStr.length; i++) {
          let ch = whichStr[i];
          let t = (now - whichStart - i * letterSpacing) / bounceSpeed;
          let bounce = sin(t) * bounceHeight * (t > 0 ? 1 : 0);
          text(ch, mainX, whichY + bounce);
          mainX += textWidth(ch);
        }
      } else {
        text(whichStr, textLeftX, whichY);
      }
      let whichBaseline = whichY + textAscent();

      // FIRST?
      textFont(fontGrotta);
      textStyle(BOLD);
      textSize(baseFontSize * 0.6);

      let firstStr = "FIRST?";
      let firstX = textLeftX + 80;
      let firstStart = whichEnd + wordPause;
      let firstEnd =
        firstStart + (firstStr.length - 1) * letterSpacing + bounceSpeed;

      // Drop shadow for FIRST?
      fill(0, 0, 0, textAlpha * 0.24);
      noStroke();
      if (now >= firstStart && now < firstEnd + wordPause) {
        let shadowX = textLeftX + 80;
        for (let i = 0; i < firstStr.length; i++) {
          let ch = firstStr[i];
          let t = (now - firstStart - i * letterSpacing) / bounceSpeed;
          let bounce = sin(t) * bounceHeight * (t > 0 ? 1 : 0);
          text(ch, shadowX + 6, firstY + bounce + 6);
          shadowX += textWidth(ch);
        }
      } else {
        text(firstStr, textLeftX + 80 + 6, firstY + 6);
      }

      // Main FIRST? text
      fill(255, 255, 255, textAlpha);
      stroke(0, 0, 0, textAlpha);
      strokeWeight(2);
      if (now >= firstStart && now < firstEnd + wordPause) {
        let mainX = textLeftX + 80;
        for (let i = 0; i < firstStr.length; i++) {
          let ch = firstStr[i];
          let t = (now - firstStart - i * letterSpacing) / bounceSpeed;
          let bounce = sin(t) * bounceHeight * (t > 0 ? 1 : 0);
          text(ch, mainX, firstY + bounce);
          mainX += textWidth(ch);
        }
      } else {
        text(firstStr, textLeftX + 80, firstY);
      }
      let firstBaseline = firstY + textAscent();

      // SIDE (centered)
      textFont(fontSnell);
      textStyle(NORMAL);
      textSize(baseFontSize * 0.8);
      fill(238, 238, 238, textAlpha); // Apply alpha to "Side" text
      stroke(0, 0, 0, textAlpha);
      strokeWeight(2);

      let sideStr = "Side";
      let sideAscent = textAscent();
      let sideBaseline = (whichBaseline + firstBaseline) / 2;
      let sideY = sideBaseline - sideAscent;

      let sideX = textLeftX + 80;
      let sideStart = firstEnd + wordPause;

      for (let i = 0; i < sideStr.length; i++) {
        let ch = sideStr[i];
        let t = (now - sideStart - i * letterSpacing) / bounceSpeed;
        let bounce = sin(t) * bounceHeight * (t > 0 ? 1 : 0);
        text(ch, sideX, sideY + bounce);
        sideX += textWidth(ch);
      }

      // PRICE DISPLAY
      let priceX = skyDrawX + skyDrawW * 0.06;
      let priceY = skyDrawY + skyDrawH - baseFontSize * 0.9;

      fill(255, 215, 0, textAlpha); // Apply alpha to price text
      stroke(0, 0, 0, textAlpha);
      strokeWeight(2);
      textSize(baseFontSize * 0.5);

      let totalVotes = whiteFillingClicks + brownFillingClicks;

      let smallTextSize = baseFontSize * 0.3;
      let bigTextSize = baseFontSize * 0.5;

      // Draw small -$
      textFont("Helvetica");
      textSize(smallTextSize);
      let dashDollarStr = "-$";
      let dashDollarWidth = textWidth(dashDollarStr);

      let baselineOffset = bigTextSize - smallTextSize;
      text(dashDollarStr, priceX, priceY + baselineOffset);

      // Draw big total votes number
      textFont(fontGrotta);
      textSize(bigTextSize);
      let votesStr = totalVotes.toString();
      let votesWidth = textWidth(votesStr);
      text(votesStr, priceX + dashDollarWidth, priceY);

      // Draw small dash after number
      textFont("Helvetica");
      textSize(smallTextSize);
      let dashStr = "-";
      let dashWidth = textWidth(dashStr);
      text(
        dashStr,
        priceX + dashDollarWidth + votesWidth,
        priceY + baselineOffset
      );

      // Center "votes" label
      let totalWidth = dashDollarWidth + votesWidth + dashWidth;
      let centerX = priceX + totalWidth / 2;

      textFont(fontGrotta);
      textStyle(NORMAL);
      textSize(baseFontSize * 0.2);
      textAlign(CENTER);
      text("votes", centerX, priceY + 6 + baseFontSize * 0.4);
      textAlign(LEFT);
    }
  } // End of tvIsOn check for text

  // Only show ice cream content when TV is on and not during turn-on animation
  if (tvIsOn && !tvTurningOn) {
    // Apply smooth fade effect to casata elements using the same timing as sky background
    let casataAlpha = contentAlpha;

    if (casataAlpha > 0) {
      // Only draw if there's some opacity
      push();

      // Add glitching effects to casata elements during fade-in
      if (casataAlpha < 255) {
        // Random displacement glitches for ice cream elements
        if (random() < 0.25) {
          let glitchX = random(-6, 6) * ((255 - casataAlpha) / 255);
          let glitchY = random(-3, 3) * ((255 - casataAlpha) / 255);
          translate(glitchX, glitchY);
        }

        // Occasional color separation for ice cream
        if (random() < 0.1) {
          tint(255, casataAlpha * 0.8, casataAlpha * 0.8, casataAlpha);
        } else {
          tint(casataAlpha, casataAlpha, casataAlpha);
        }
      } else {
        tint(casataAlpha, casataAlpha, casataAlpha);
      }

      translate(casataCenterX, casataCenterY - 10);
      rotate(-casataRotation);
      scale(casataScale);

      // SUN
      push();
      translate(150, 70);

      let sunRadiusX = whiteH * 0.7 * casataScaleFactor;
      let sunRadiusY = whiteH * 0.9 * casataScaleFactor;

      fill(0);
      noStroke();
      ellipse(20, 20, sunRadiusX * 2.8, sunRadiusY * 2.8);

      fill("#FFFF00");
      stroke("#FFFF00");
      strokeWeight(3);
      ellipse(0, 0, sunRadiusX * 2.8, sunRadiusY * 2.8);

      // rotating star rays
      push();
      let starAngle = (millis() / 24000) * TWO_PI;
      rotate(starAngle);
      fill("#FFFFFF");
      stroke("#000000");
      strokeWeight(0.5);
      beginShape();
      for (let i = 0; i < 24; i++) {
        let angle = (TWO_PI / 24) * i;
        let outerRadius = i % 2 === 0 ? sunRadiusX * 1.25 : sunRadiusX * 0.6;
        let x = cos(angle) * outerRadius;
        let y = sin(angle) * outerRadius * (sunRadiusY / sunRadiusX);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
      pop();

      const scaledWhiteW = whiteW;
      const scaledWhiteH = whiteH;
      const scaledBrownW = brownW;
      const scaledBrownH = brownH;

      let localWhiteX = -180 + whiteDrag.x / casataScale;
      let localWhiteY = -100 + whiteDrag.y / casataScale;
      let localBrownX = 180 + brownDrag.x / casataScale;
      let localBrownY = -50 + brownDrag.y / casataScale;

      const whiteFillingHeight = scaledWhiteH * whiteFillingHeightRatio;
      const whiteFillingYOffset = scaledWhiteH * whiteFillingYOffsetRatio;
      const whiteFillingX =
        localWhiteX + whiteImageOffsetX + whiteFillingXOffset;
      const whiteFillingY =
        localWhiteY + whiteImageOffsetY + whiteFillingYOffset;

      if (isHoveringWhite) {
        fill("#FFFDF9");
      } else {
        fill("#f3e9d9");
      }
      noStroke();
      let maxWhiteWidth = whiteImageOffsetX + whiteFillingXOffset + whiteW;
      let whiteFillRight = whiteFillingX + whiteFillWidth - 26.5;
      let safeWhiteWidth = min(whiteFillRight, maxWhiteWidth) - whiteFillingX;
      rect(whiteFillingX, whiteFillingY, safeWhiteWidth, whiteFillingHeight);
      image(
        whitePart,
        localWhiteX + whiteImageOffsetX,
        localWhiteY + whiteImageOffsetY,
        scaledWhiteW,
        scaledWhiteH
      );

      const brownFillingHeight = scaledBrownH * brownFillingHeightRatio;
      const brownFillingYOffset = scaledBrownH * brownFillingYOffsetRatio;
      const brownFillingRight =
        localBrownX + brownImageOffsetX + brownFillingXOffset;
      const brownFillingY =
        localBrownY + brownImageOffsetY + brownFillingYOffset;
      const brownFillingX = brownFillingRight - brownFillWidth;
      const brownVisualWidth = brownFillWidth + 27.5;

      if (isHoveringBrown) {
        fill("#9E6659");
      } else {
        fill("#bc7567");
      }
      rect(
        brownFillingX,
        brownFillingY,
        brownFillWidth + 27.5,
        brownFillingHeight
      );
      image(
        brownPart,
        localBrownX + brownImageOffsetX,
        localBrownY + brownImageOffsetY,
        scaledBrownW,
        scaledBrownH
      );

      // SHOW LABELS OR NUMBERS
      fill(0);
      textAlign(CENTER, CENTER);

      if (hasClicked && (whiteFillingClicks > 0 || brownFillingClicks > 0)) {
        textSize(baseFontSize * 0.08);

        let whiteVisibleWidth = safeWhiteWidth;
        let whiteCenterX = whiteFillingX + whiteVisibleWidth / 2;
        let whiteCenterY = whiteFillingY + whiteFillingHeight / 2;
        text(whiteFillingClicks, whiteCenterX, whiteCenterY);

        let brownVisibleWidth = brownFillWidth + 27.5;
        let brownCenterX = brownFillingX + brownVisibleWidth / 2;
        let brownCenterY = brownFillingY + brownFillingHeight / 2;
        text(brownFillingClicks, brownCenterX, brownCenterY);
      }

      // UPDATE HOVER FLAGS
      if (!hasClicked) {
        let mx = mouseX - casataCenterX;
        let my = mouseY - casataCenterY;
        let rotMx = mx * cos(-casataRotation) - my * sin(-casataRotation);
        let rotMy = mx * sin(-casataRotation) + my * cos(-casataRotation);
        let localMx = rotMx / casataScale;
        let localMy = rotMy / casataScale;

        isHoveringWhite =
          localMx > whiteFillingX &&
          localMx < whiteFillingX + (whiteFillWidth - 26.5) &&
          localMy > whiteFillingY &&
          localMy < whiteFillingY + whiteFillingHeight;

        let hoverPaddingX = 80;
        let hoverPaddingY = 120;

        isHoveringBrown =
          localMx > brownFillingX - hoverPaddingX &&
          localMx < brownFillingX + brownVisualWidth + hoverPaddingX &&
          localMy > brownFillingY - hoverPaddingY &&
          localMy < brownFillingY + brownFillingHeight + hoverPaddingY;
      }

      pop();

      // Reset tint after casata elements
      noTint();
    }
  } // End of ice cream content

  // Only show TV effects when TV is on and not during turn-on animation
  if (tvIsOn && !tvTurningOn) {
    // SCAN LINES AND TV EFFECTS (only when TV is on)
    if (frameCount % 8 === 0) {
      let scanLineCount = 2;
      for (let i = 0; i < scanLineCount; i++) {
        let lineY = skyDrawY + random(skyDrawH);
        let lineAlpha = random(20, 50);
        let lineWidth = random(0.3, 0.8);

        stroke(255, lineAlpha);
        strokeWeight(lineWidth);
        line(skyDrawX, lineY, skyDrawX + skyDrawW, lineY);
      }
    }

    if (random() < 0.05) {
      let interferenceX = skyDrawX + random(skyDrawW);
      let interferenceAlpha = random(30, 70);

      stroke(255, interferenceAlpha);
      strokeWeight(random(0.5, 1));
      line(interferenceX, skyDrawY, interferenceX, skyDrawY + skyDrawH);
    }

    // TV GLASS EFFECTS
    for (let i = 0; i < 6; i++) {
      let alpha = map(i, 0, 14, 0, 25);
      fill(0, alpha);
      noStroke();
      rect(skyDrawX - i, skyDrawY - i, skyDrawW + i * 2, skyDrawH + i * 2);
    }

    stroke(255, 20);
    strokeWeight(1.5);
    for (let i = 0; i < 3; i++) {
      let reflectionX = skyDrawX + skyDrawW * (0.25 + i * 0.3);
      line(reflectionX, skyDrawY, reflectionX + 25, skyDrawY + skyDrawH);
    }

    fill(255, 3);
    noStroke();
    ellipse(
      skyDrawX + skyDrawW * 0.3,
      skyDrawY + skyDrawH * 0.2,
      skyDrawW * 0.4,
      skyDrawH * 0.5
    );
    ellipse(
      skyDrawX + skyDrawW * 0.7,
      skyDrawY + skyDrawH * 0.7,
      skyDrawW * 0.3,
      skyDrawH * 0.4
    );

    fill(0, 20);
    noStroke();
    rect(skyDrawX, skyDrawY, skyDrawW, 12);
    rect(skyDrawX, skyDrawY + skyDrawH - 12, skyDrawW, 12);
    rect(skyDrawX, skyDrawY, 12, skyDrawH);
    rect(skyDrawX + skyDrawW - 12, skyDrawY, 12, skyDrawH);

    fill(255, 25);
    noStroke();
    ellipse(skyDrawX + skyDrawW * 0.1, skyDrawY + skyDrawH * 0.1, 40, 60);
    ellipse(skyDrawX + skyDrawW * 0.9, skyDrawY + skyDrawH * 0.1, 30, 45);
  }

  // SPEAKER DOTS (always visible)
  let dotCols = 14;
  let dotSpacingX = 12;
  let dotSpacingY = 12;
  let dotRadius = 2;
  let speakerLeftX = width - 190;
  let speakerTopY = skyDrawY;
  let dotRows = Math.floor(skyDrawH / dotSpacingY);

  fill(255, 180);
  noStroke();
  for (let i = 0; i < dotCols; i++) {
    for (let j = 0; j < dotRows; j++) {
      ellipse(
        speakerLeftX + i * dotSpacingX,
        speakerTopY + j * dotSpacingY,
        dotRadius * 2
      );
    }
  }

  // TV BUTTONS (always visible)
  let buttonCount = 4;
  let buttonSpacing = 50;
  let buttonRadius = 14;
  let buttonX = speakerLeftX - 40;
  let firstButtonY = skyDrawY + skyDrawH - buttonCount * buttonSpacing;
  fill(50);
  stroke(200);
  strokeWeight(0.6);
  for (let i = 0; i < buttonCount; i++) {
    ellipse(buttonX, firstButtonY + i * buttonSpacing, buttonRadius * 2);
  }

  fill(tvIsOn ? "lime" : "red");
  textAlign(CENTER, CENTER);
  textSize(10);
  text(tvIsOn ? "ON" : "OFF", buttonX, firstButtonY - 24);

  noStroke(); // Reset stroke
  noTint(); // Reset tint
}

function drawBafiringGlitch(alphaOverride = 255) {
  push();

  // Very subtle RGB channel offset (much smaller)
  let offset = random(1, 3);

  // Only do channel separation occasionally and subtly
  if (random() < 0.7) {
    // Red channel slight offset
    tint(255, 0, 0, alphaOverride * 0.3);
    image(skyBg, skyDrawX + offset, skyDrawY, skyDrawW, skyDrawH);

    // Green channel slight offset
    tint(0, 255, 0, alphaOverride * 0.3);
    image(skyBg, skyDrawX - offset, skyDrawY, skyDrawW, skyDrawH);

    // Blue channel
    tint(0, 0, 255, alphaOverride * 0.3);
    image(skyBg, skyDrawX, skyDrawY + random(-1, 1), skyDrawW, skyDrawH);

    noTint();
  }

  // Add just a few thin scan lines occasionally
  if (random() < 0.5) {
    for (let i = 0; i < random(2, 5); i++) {
      let y = skyDrawY + random(skyDrawH);
      stroke(255, random(30, 80));
      strokeWeight(random(0.5, 1));
      line(skyDrawX, y, skyDrawX + skyDrawW, y);
    }
    noStroke();
  }

  // Very brief brightness flicker
  if (random() < 0.3) {
    tint(255, random(200, 255));
    image(skyBg, skyDrawX, skyDrawY, skyDrawW, skyDrawH);
    noTint();
  }

  pop();
}

export function mouseReleasedIceCreamSandwichScene() {
  // Toggle TV ON/OFF
  let buttonY = skyDrawY + skyDrawH - 4 * 50; // 4th button (on-off)
  let d = dist(mouseX, mouseY, width - 190 - 40, buttonY);
  if (d < 14) {
    // Play click sound
    if (clickButtonSound.isLoaded()) {
      clickButtonSound.setVolume(0.3);
      clickButtonSound.play();
    }

    if (!tvIsOn && !tvTurningOn) {
      // Start turn-on animation
      tvTurningOn = true;
      tvTurnOnStart = millis();
      tvIsOn = true;

      // Start playing background sounds when TV turns on
      // Start playing background sounds when TV turns on
      if (radioStaticSound.isLoaded()) {
        radioStaticSound.loop();
        radioStaticSound.setVolume(0.1); // was 0.3, now 0.1
      }
      if (happyTuneSound.isLoaded()) {
        happyTuneSound.loop();
        happyTuneSound.setVolume(0.2); // was 0.5, now 0.2
      }
    } else if (tvIsOn && !tvTurningOn) {
      // Turn off immediately
      tvIsOn = false;

      // Play shutdown sound
      // Play shutdown sound
      if (tvShutDownSound.isLoaded()) {
        tvShutDownSound.setVolume(0.3); // Add this line
        tvShutDownSound.play();
      }

      // Stop background sounds when TV turns off
      if (radioStaticSound.isPlaying()) {
        radioStaticSound.stop();
      }
      if (happyTuneSound.isPlaying()) {
        happyTuneSound.stop();
      }
    }
    return; // Exit early on toggle to prevent accidental interactions
  }

  // If TV is off or turning on, don't allow ice cream interactions
  if (!tvIsOn || tvTurningOn) return;

  let casataScale = skyDrawH * 0.0008 * casataScaleFactor;
  let casataRightEdge = skyDrawX + skyDrawW * 0.75;
  let casataBaseY = skyDrawY + skyDrawH / 2.4;

  let casataCenterX = casataRightEdge - 200 * casataScale;
  let casataCenterY = casataBaseY;

  let mx = mouseX - casataCenterX;
  let my = mouseY - casataCenterY;
  let rotMx = mx * cos(-casataRotation) - my * sin(-casataRotation);
  let rotMy = mx * sin(-casataRotation) + my * cos(-casataRotation);
  let localMx = rotMx / casataScale;
  let localMy = rotMy / casataScale;

  let localWhiteX = -180 + whiteDrag.x / casataScale;
  let localWhiteY = -100 + whiteDrag.y / casataScale;
  let localBrownX = 180 + brownDrag.x / casataScale;
  let localBrownY = -50 + brownDrag.y / casataScale;

  const whiteFillingHeight = whiteH * whiteFillingHeightRatio;
  const whiteFillingX = localWhiteX + whiteImageOffsetX + whiteFillingXOffset;
  const whiteFillingY =
    localWhiteY + whiteImageOffsetY + whiteFillingYOffsetRatio * whiteH;

  const brownFillingHeight = whiteH * brownFillingHeightRatio;
  const brownFillingRight =
    localBrownX + brownImageOffsetX + brownFillingXOffset;
  const brownFillingY =
    localBrownY + brownImageOffsetY + whiteFillingYOffsetRatio * whiteH;
  const brownFillingX = brownFillingRight - brownFillWidth;
  const brownVisualWidth = brownFillWidth + 27.5;

  const clickedWhite =
    localMx > whiteFillingX &&
    localMx < whiteFillingX + (whiteFillWidth - 26.5) &&
    localMy > whiteFillingY &&
    localMy < whiteFillingY + whiteFillingHeight;

  let hoverPaddingX = 80;
  let hoverPaddingY = 120;

  const clickedBrown =
    localMx > brownFillingX - hoverPaddingX &&
    localMx < brownFillingX + brownVisualWidth + hoverPaddingX &&
    localMy > brownFillingY - hoverPaddingY &&
    localMy < brownFillingY + brownFillingHeight + hoverPaddingY;

  if (clickedWhite) {
    if (!hasClicked) {
      hasClicked = true;
      // let counts = await getIceCreamSandwichCounts();
      // whiteFillingClicks = counts.vanila;
      // brownFillingClicks = counts.chocolate;
    }

    whiteFillingClicks++;
    overshooting = true;
    recoveringFromOvershoot = false;
    targetWhiteWidth += overshootAmount;
    setTimeout(() => {
      updateWidthsProportionally();
      recoveringFromOvershoot = true;
    }, 150);
    userPick = VANILA;
  } else if (clickedBrown) {
    if (!hasClicked) {
      hasClicked = true;
      // let counts = getIceCreamSandwichCounts();
      // whiteFillingClicks = counts.vanila;
      // brownFillingClicks = counts.chocolate;
    }

    brownFillingClicks++;
    overshooting = true;
    recoveringFromOvershoot = false;
    targetBrownWidth += overshootAmount;
    setTimeout(() => {
      updateWidthsProportionally();
      recoveringFromOvershoot = true;
    }, 150);
    userPick = CHOCOLATE;
  }
}

function updateWidthsProportionally() {
  const totalClicks = whiteFillingClicks + brownFillingClicks;

  // Before any clicks, show perfect 50/50 split
  if (totalClicks === 0) {
    targetWhiteWidth = 292;
    targetBrownWidth = 238;
    return;
  }

  const whiteRatio = whiteFillingClicks / totalClicks;
  const brownRatio = brownFillingClicks / totalClicks;

  // Total visual area should remain constant
  const totalVisualArea = 292 - 26.5 + (238 + 27.5); // 530 total visual width

  const targetWhiteVisual = totalVisualArea * whiteRatio;
  const targetBrownVisual = totalVisualArea * brownRatio;

  // Convert back to fill widths
  targetWhiteWidth = targetWhiteVisual + 26.5;
  targetBrownWidth = targetBrownVisual - 27.5;

  // Ensure minimums
  targetWhiteWidth = max(targetWhiteWidth, minVisualWidth + 26.5);
  targetBrownWidth = max(targetBrownWidth, minVisualWidth - 27.5);

  // If brown would be too small, adjust
  if (targetBrownWidth < minVisualWidth) {
    targetBrownWidth = minVisualWidth;
    targetWhiteWidth = totalVisualArea - minVisualWidth + 26.5;
  }

  // If white would be too small, adjust
  if (targetWhiteWidth < minVisualWidth + 26.5) {
    targetWhiteWidth = minVisualWidth + 26.5;
    targetBrownWidth = totalVisualArea - minVisualWidth - 27.5;
  }
}

function applyFillingClicks() {
  const totalClicks = whiteFillingClicks + brownFillingClicks;

  // If no clicks yet, keep both sides equal to original values
  if (totalClicks === 0) {
    targetWhiteWidth = 292;
    targetBrownWidth = 238;
    return;
  }

  // Calculate proportional widths based on click percentages
  const whitePercentage = whiteFillingClicks / totalClicks;
  const brownPercentage = brownFillingClicks / totalClicks;

  // Total visual area should remain constant
  const totalVisualArea = 292 - 26.5 + (238 + 27.5); // 530 total visual width

  const targetWhiteVisual = totalVisualArea * whitePercentage;
  const targetBrownVisual = totalVisualArea * brownPercentage;

  // Convert back to fill widths
  targetWhiteWidth = targetWhiteVisual + 26.5;
  targetBrownWidth = targetBrownVisual - 27.5;

  // Ensure minimums
  targetWhiteWidth = max(targetWhiteWidth, minVisualWidth + 26.5);
  targetBrownWidth = max(targetBrownWidth, minVisualWidth - 27.5);

  // If brown would be too small, adjust
  if (targetBrownWidth < minVisualWidth) {
    targetBrownWidth = minVisualWidth;
    targetWhiteWidth = totalVisualArea - minVisualWidth + 26.5;
  }

  // If white would be too small, adjust
  if (targetWhiteWidth < minVisualWidth + 26.5) {
    targetWhiteWidth = minVisualWidth + 26.5;
    targetBrownWidth = totalVisualArea - minVisualWidth - 27.5;
  }
}

function setWhiteFillingClicks(count) {
  whiteFillingClicks = count;
  applyFillingClicks();
}

function setBrownFillingClicks(count) {
  brownFillingClicks = count;
  applyFillingClicks();
}

//lior's code
export function getIceCreamSandwichUserPick() {
  return userPick;
}
