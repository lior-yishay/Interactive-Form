let palette = {};
let fireGif; // Changed from tvImg to fireGif
let tickerOffset = 0;
let glitchTime = 0;
let tickerPaused = false;
let breakingNewsSound; // Add sound variable
let glitchSound; // Add glitch sound variable
let soundPlayed = false; // Track if sound has been played
let lastGlitchSoundTime = 0; // Track when last glitch sound played

export function preloadSmileEndingScene() {
  fireGif = loadImage("./assets/fire1.gif"); // Changed to load the GIF file
  breakingNewsSound = loadSound(
    "./assets/breaking-news-intro-logo-2-314321.mp3"
  ); // Load the sound
  glitchSound = loadSound("./assets/glitch-82312.mp3"); // Load the glitch sound
}

export function setupSmileEndingScene() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  angleMode(RADIANS);
  palette = {
    pageBg: color(15, 13, 27),
    banner: color(46, 48, 87),
    ribbon: color(255, 79, 23),
    bar: color(245),
    white: color(255),
    grey: color(229),
  };

  // Play the breaking news sound once at startup
  if (breakingNewsSound && !soundPlayed) {
    breakingNewsSound.play();
    soundPlayed = true;
  }
}

export function windowResizedSmileEndingScene() {
  resizeCanvas(windowWidth, windowHeight);
}

export function drawSmileEndingScene() {
  background(palette.pageBg);
  noStroke();

  // Update glitch timer
  glitchTime += 0.1;

  // Random glitch trigger - both lines and shake
  let shouldGlitch = random() < 0.02; // Moderate frequency
  let glitchLines = shouldGlitch ? floor(random(3, 8)) : 0; // Number of glitch lines
  let glitchShake = shouldGlitch ? random(1, 3) : 0; // Shake intensity

  // Play glitch sound occasionally during visual glitches
  if (shouldGlitch && glitchSound && millis() - lastGlitchSoundTime > 3000) {
    // Only play if it's been at least 3 seconds since last glitch sound
    if (random() < 0.3) {
      // 30% chance to play sound with visual glitch
      glitchSound.play();
      lastGlitchSoundTime = millis();
    }
  }

  // Increased width and height, reduced padding
  const bw = width * 0.92; // Increased from 0.8
  const bh = height * 0.65; // Adjusted for better centering
  const bx = (width - bw) / 2;
  const by = (height - bh) / 2 - height * 0.05; // Moved up slightly for visual centering

  const bannerH = bh * 0.9;
  const greyH = bh * 0.2;
  const barH = bh * 0.08;

  // Apply normal drawing with slight shake
  push();
  if (glitchShake > 0) {
    translate(
      random(-glitchShake, glitchShake),
      random(-glitchShake / 2, glitchShake / 2)
    );
  }

  fill(palette.banner);
  rect(bx, by, bw, bannerH);
  fill(palette.grey);
  rect(bx, by + bannerH, bw, greyH);
  fill(palette.bar);
  rect(bx, by + bannerH + greyH, bw, barH);

  pop();

  /* --------- Fire GIF Image --------- */
  push();
  if (glitchShake > 0) {
    translate(
      random(-glitchShake, glitchShake),
      random(-glitchShake, glitchShake)
    );
    // Subtle color distortion
    if (random() < 0.4) {
      tint(random(220, 255), random(200, 255), random(200, 255));
    }
  }

  const padding = 15; // Reduced padding
  const topPadding = 25; // Extra padding from top of blue area
  const fireAspect = fireGif.width / fireGif.height; // Changed variable name
  let fireW = width * 0.15; // Changed variable name
  fireW = map(width, 400, 1800, width * 0.15, width * 0.35);
  fireW = constrain(fireW, 120, width * 0.4);
  let fireH = fireW / fireAspect; // Changed variable name
  const availableHeight = bannerH + greyH - padding - topPadding;
  if (fireH > availableHeight) {
    fireH = availableHeight;
    fireW = fireH * fireAspect;
  }
  const fireX = bx + width * 0.015; // Changed variable name
  const fireY = by + bannerH + greyH - fireH - padding; // Changed variable name
  image(fireGif, fireX, fireY, fireW, fireH); // Updated to use fire variables
  pop();

  /* --------- Main headline --------- */
  push();
  if (glitchShake > 0) {
    translate(
      random(-glitchShake, glitchShake),
      random(-glitchShake / 2, glitchShake / 2)
    );
    // Occasional color shift
    if (random() < 0.3) {
      fill(random(200, 255), random(200, 255), 255);
    } else {
      fill(palette.white);
    }
  } else {
    fill(palette.white);
  }

  const headline = "THERE IS STILL\nNO PEACE";
  const headlineBoxW = bw * 0.5;
  const headlineBoxH = bh * 0.35;
  const hx = fireX + fireW + width * 0.02; // Updated to use fire variables
  const hy = by + bh * 0.36; // Removed the shift adjustments

  textAlign(LEFT, TOP);
  let hSize = fitMultiline(headline, headlineBoxW, headlineBoxH);
  textSize(hSize);
  textLeading(hSize * 1.06);
  textStyle(BOLD);
  text(headline, hx, hy);
  textStyle(NORMAL);
  pop();

  /* --------- Angled Banner Edge with Text --------- */
  const rh = bh * 0.12;
  const rw = bw * 0.45;
  const angleDeg = 70;
  const angleRad = radians(angleDeg);
  const edgeW = rw * 0.9;
  const edgeX = hx - width * 0.005; // Reduced from 0.01
  const edgeY = by + bh * 0.17;
  const offsetX = rh / tan(angleRad);

  fill(palette.ribbon);
  beginShape();
  vertex(edgeX, edgeY);
  vertex(edgeX + edgeW, edgeY);
  vertex(edgeX + edgeW - offsetX, edgeY + rh);
  vertex(edgeX, edgeY + rh);
  endShape(CLOSE);

  const ribbonText = "Breaking News";
  fill(palette.white);
  textAlign(LEFT, CENTER);
  let rSize = fitText(ribbonText, edgeW * 0.9, rh * 0.8);
  textSize(rSize);
  text(ribbonText, edgeX + edgeW * 0.05, edgeY + rh / 2);

  /* --------- News Ticker --------- */
  push();
  if (glitchShake > 0) {
    translate(
      random(-glitchShake, glitchShake),
      random(-glitchShake / 3, glitchShake / 3)
    );
  }

  const ticker = "YOUR SMILE CHANGED NOTHING. HOW SUPRISING.     "; // Changed text
  const tickerW = bw * 0.96;
  const tickerH = barH * 0.45;
  const tx = bx + bw * 0.02;
  const ty = by + bannerH + greyH + barH / 2;

  textAlign(LEFT, CENTER);
  let tSize = fitText(ticker, tickerW, tickerH);
  textSize(tSize);
  textStyle(BOLD);
  fill(0);

  // Create moving ticker effect (left to right) - pause on hover
  const tickerSpeed = 1.5;

  // Check if mouse is over ticker area
  let mouseOverTicker =
    mouseX >= tx &&
    mouseX <= tx + tickerW &&
    mouseY >= ty - tickerH / 2 &&
    mouseY <= ty + tickerH / 2;

  if (!mouseOverTicker) {
    tickerOffset += tickerSpeed;
  }

  // Get the width of the ticker text
  const fullTickerWidth = textWidth(ticker);

  // Reset offset when text completes one cycle
  if (tickerOffset >= fullTickerWidth) {
    tickerOffset = 0;
  }

  // Create clipping area for the ticker
  // Clip to the ticker area
  let clipX = tx;
  let clipY = ty - tickerH / 2;
  let clipW = tickerW;
  let clipH = tickerH;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(clipX, clipY, clipW, clipH);
  drawingContext.clip();

  // Fill the entire ticker area with repeating text
  let startX = tx + (tickerOffset % fullTickerWidth) - fullTickerWidth;

  // Draw enough copies to fill the entire ticker width
  for (let i = 0; i < Math.ceil(tickerW / fullTickerWidth) + 2; i++) {
    text(ticker, startX + i * fullTickerWidth, ty);
  }

  drawingContext.restore();

  textStyle(NORMAL);
  pop();

  // Add horizontal line glitch effect over everything
  if (glitchLines > 0) {
    push();
    stroke(255, 150); // Semi-transparent white
    strokeWeight(1);

    for (let i = 0; i < glitchLines; i++) {
      let lineY = random(by, by + bh) + random(-glitchShake, glitchShake);
      let lineX1 = bx + random(-15, 15);
      let lineX2 = bx + bw + random(-15, 15);

      // Draw glitch line
      line(lineX1, lineY, lineX2, lineY);

      // Occasionally add a thicker line or color distortion
      if (random() < 0.4) {
        strokeWeight(2);
        stroke(random(150, 255), random(100, 200), random(100, 200), 120);
        line(lineX1, lineY + 1, lineX2, lineY + 1);
        strokeWeight(1);
        stroke(255, 150);
      }
    }
    pop();
  }
}

/* ---------- Text-fitting helpers ---------- */
function fitText(str, maxW, maxH) {
  let sz = maxH;
  textSize(sz);
  while (
    (textWidth(str) > maxW || textAscent() + textDescent() > maxH) &&
    sz > 5
  ) {
    sz--;
    textSize(sz);
  }
  return sz;
}

function fitMultiline(str, maxW, maxH) {
  const lines = str.split("\n");
  let sz = maxH / lines.length;
  textSize(sz);
  textLeading(sz * 1.06);
  const fits = () =>
    lines.every((l) => textWidth(l) <= maxW) &&
    sz * lines.length * 1.06 <= maxH;
  while (!fits() && sz > 5) {
    sz--;
    textSize(sz);
    textLeading(sz * 1.06);
  }
  return sz;
}
