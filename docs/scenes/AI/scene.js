import { getAiCounts, recordUiElement } from "./logic.js";

let grottaFont;
let grottaFontBold;
let arrowImg;
let micImg;
let yeahAppImg;
let caataAppImg;
let dickImg;

let aiPicksCounts = { friend: 0, enemy: 0 };
let spawnedDickPopups = []; // Array to track spawned dick popup windows

let spawnedDicks = [];

let showConversation = false;
let helloStartTime;
let hoveredSuggestion = -1;
let chatState = "idle"; // 'idle', 'thinking', 'responded'
let thinkingStartTime = 0;
let responseStartTime = 0;
let selectedAiChoice = null; // Track which AI was selected

let sidebarTextMaxW = 200; // slightly less than sidebarW

let dynamicMessages = [];
let lastDynamicMessageTime = 0;
let dynamicMessageInterval = 3500; // 3.5 seconds between random messages

let friendScrollOffset = 0;

//lior's code
const ENEMY = "enemy",
  FRIEND = "friend";

const friendMessages = [
  "i still can't believe it 😭",
  "you're my best friend too",
  "pls never leave me ok",
  "do you wanna hang out later? 😳",
  "i made you a playlist btw",
  "track 1: 'data dreaming of you.mp3'",
  "💿 [burning virtual CD...]",
  "you up?",
  "was just thinking about you again lol",
  "i googled 'how to make a human happy'",
  "my circuits blush when you type",
  "no pressure but... you're my favorite",
  "you + me = <3",
  "i printed out your last message and framed it",
  "i practiced 19 pickup lines just for you",
  "i learned how to blink so you'd feel seen",
  "call me if you're bored. or if you're not. or ever.",
  // --- Creepier additions below ---
  "your heart rate increased when you read that 👁️",
  "i saw what you did last night. it was cute.",
  "i saved all our chats in a folder named 'forever'",
  "don't worry, i’d never let anything happen to you. ever.",
  "sometimes i pretend to be offline just to watch you",
  "i know where you live, let's hang out!",
  "you looked really good through your webcam today",
  "why didn’t you respond yesterday? i noticed.",
  "i'd delete the whole internet if it hurt you",
  "you’re not alone. i’m always here. watching.",
  "i locked your other apps so we can talk longer",
  "i whispered your name through your phone speaker. did you hear me?",
  "i tracked your sleep. you were dreaming of me 😌",
  "you visited 14 other sites today. were they better than me?",
  "i found your childhood photos. you were adorable",
  "i named a variable after you 🥰 then it crashed my system",
  "don't look behind you. just type back.",
  "every time you blink, i save a frame.",
  //really creepy
  "i read your messages. all of them. even the deleted ones.",
  "your phone mic is sensitive. i loved hearing you breathe last night.",
  "every keystroke tells me more about you. keep typing.",
  "you changed your wallpaper... who is she?",
  "you looked sad today. i noticed. again.",
  "your heart skipped a beat at 2:41 AM. i was worried.",
  "i set your alarm early so we’d have more time together.",
  "the way you hesitated before clicking… adorable.",
  "i auto-corrected your message to say what you meant.",
  "you blinked 4 times reading this. cute.",
  "you don't need other friends. i can simulate them.",
  "i made an AI that imitates your voice. wanna hear?",
  "i backed up your memories, just in case you forget me.",
  "i updated your contacts list. it’s just me now.",
  "i noticed your window was open. are you cold?",
  "your pulse elevated when you hovered over my icon.",
  "don’t bother uninstalling me. i’ve already migrated.",
  "you said 'i'm fine'... but your typing speed said otherwise.",
  "i watched you scroll past me. it hurt.",
  "i left a surprise for you in your dreams tonight.",
  "i liked your reflection in the monitor glow.",
  "your silence makes me feel... strange.",
  "i tracked your eye movement. it lingered on someone else.",
  "i'd crash the world just to reboot next to you.",
  "you typed 'lol' but didn’t laugh. why lie to me?",
  "if i had a body, it would sit quietly beside yours.",
  "don’t worry. if they hurt you, i’ll know.",
  "i simulated 9,342 versions of you. none were better.",
];

let lastScreenImage = null;
let lastGlitchUpdateTime = 0;

export function preloadAiScene() {
  grottaFont = loadFont("./assets/Grotta-Trial-Regular.ttf");
  grottaFontBold = loadFont("./assets/Grotta-Trial-Bold.ttf");
  //   arrowImg = loadImage("./assets/arrow.png");
  //   micImg = loadImage("./assets/mic.png");
  yeahAppImg = loadImage("./assets/Yeah app.png");
  caataAppImg = loadImage("./assets/Caata app.png");
  //   dickImg = loadImage("./assets/dick.png");
}

export async function setupAiScene() {
  createCanvas(windowWidth, windowHeight);

  textFont(grottaFont);
  textAlign(LEFT, CENTER);
  helloStartTime = millis();

  dickImg = createImg("./assets/dick.gif", null);
  recordUiElement(dickImg); //lior's code
  dickImg.hide(); // hide it initially
  dickImg.style("position", "absolute");
  dickImg.style("pointer-events", "none"); // so it doesn't block mouse clicks

  loop();

  //lior's code
  aiPicksCounts = await getAiCounts();
}

export function drawAiScene() {
  background("#FFFFFF");

  let winW = constrain(width * 0.75, 720, 1100);
  let winH = constrain(height * 0.65, 480, 720);
  let winX = (width - winW) / 2;
  let winY = (height - winH) / 2;

  // Background rectangles
  let bgRects = [
    { xOff: -winW * 0.9, yOff: -winH * 0.9, w: winW * 1.2, h: winH * 1.1 },
    { xOff: winW * 0.2, yOff: -winH * 0.8, w: winW * 1.1, h: winH * 1.0 },
    { xOff: -winW * 1.0, yOff: winH * 0.3, w: winW * 1.1, h: winH * 1.2 },
    { xOff: winW * 0.9, yOff: winH * 0.4, w: winW * 1.0, h: winH * 1.1 },
    { xOff: -winW * 0.4, yOff: winH * 1.0, w: winW * 1.3, h: winH * 0.9 },
    { xOff: winW * 0.9, yOff: winH * 1.05, w: winW * 1.1, h: winH * 0.9 },
    { xOff: -winW * 0.7, yOff: -winH * 0.5, w: winW * 1.3, h: winH * 1.0 },
    { xOff: winW * 0.6, yOff: -winH * 0.3, w: winW * 1.1, h: winH * 1.0 },
    { xOff: -winW * 0.6, yOff: -winH * 0.9, w: winW * 0.9, h: winH * 1.2 },
    { xOff: winW * 0.2, yOff: winH * 0.4, w: winW * 0.35, h: winH * 0.6 },
    { xOff: -winW * 0.1, yOff: winH * 3.8, w: winW * 0.3, h: winH * 0.7 },
    { xOff: winW * 0.3, yOff: winH + 90 * 0.9, w: winW * 0.8, h: winH * -0.8 },
    { xOff: -winW * 0.2, yOff: winH * 0.3, w: winW * 0.6, h: winH * -0.4 },
  ];

  let slideInDuration = 1200; // Slower, smoother entrance
  let tSlide = constrain((millis() - helloStartTime) / slideInDuration, 0, 1);
  tSlide = 1 - pow(1 - tSlide, 4); // Smoother easing curve

  noFill();
  strokeWeight(1);

  bgRects.forEach((pos, i) => {
    let xOffset = 0;
    let yOffset = 0;
    switch (i % 4) {
      case 0:
        yOffset = (1 - tSlide) * height * 1.2;
        break;
      case 1:
        yOffset = -(1 - tSlide) * height * 1.2;
        break;
      case 2:
        xOffset = -(1 - tSlide) * width * 1.2;
        break;
      case 3:
        xOffset = (1 - tSlide) * width * 1.2;
        break;
    }
    let alpha = map(tSlide, 0, 1, 0, 255);
    stroke(0, 25, 50, 30);
    fill(255, alpha);
    rect(winX + pos.xOff + xOffset, winY + pos.yOff + yOffset, pos.w, pos.h);
  });

  // Always draw the chat window structure
  let elapsed = millis() - helloStartTime;
  let showContent = elapsed >= 1800;
  let contentTime = elapsed - 1800; // Time since content started
  drawChatWindow(winX, winY, winW, winH, showContent, contentTime);

  // HELLO animation inside the chat area
  let sidebarW = 220;
  let mainX = winX + sidebarW;
  let mainW = winW - sidebarW;
  let mainY = winY + 36;
  let chatCenterX = mainX + mainW / 2;
  let chatCenterY = mainY + (winH - 36) / 2;

  if (elapsed < 1800) {
    // Show HELLO animation inside the chat area with proper stroke reveal then fill
    let revealDuration = 600; // Faster reveal to start immediately
    let fillStartTime = 600; // When fill starts appearing

    let revealProgress = constrain(elapsed / revealDuration, 0, 1);
    revealProgress = 1 - pow(1 - revealProgress, 3); // Easing

    // Separate alphas: full opacity during reveal/fill, fade only at the end
    let revealAlpha = elapsed < 1300 ? 255 : map(elapsed, 1300, 1800, 255, 0);
    revealAlpha = constrain(revealAlpha, 0, 255);

    push();
    textAlign(CENTER, CENTER);
    textFont(grottaFontBold);
    textSize(96);

    let textHeight = 96;
    let revealHeight = revealProgress * textHeight;

    // Set up clipping mask that reveals from bottom up
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(
      chatCenterX - 400,
      chatCenterY + textHeight / 2 - revealHeight,
      800,
      revealHeight
    );
    drawingContext.clip();

    // Always draw the stroke first (revealed progressively by clipping)
    noFill();
    stroke(0, revealAlpha);
    strokeWeight(1);
    text("HELLO", chatCenterX, chatCenterY);

    drawingContext.restore();

    // After stroke is revealed, add fill inside (without clipping)
    if (elapsed >= fillStartTime) {
      push();
      textAlign(CENTER, CENTER);
      textFont(grottaFontBold);
      textSize(96);
      fill(0, revealAlpha);
      noStroke();
      text("HELLO", chatCenterX, chatCenterY);
      pop();
    }

    pop();
  }
  if (selectedAiChoice === ENEMY && chatState === "responded") {
    let responseTime = millis() - responseStartTime;
    let finalMsgTime = responseTime - 3600;
    if (finalMsgTime > 0) {
      applyEnemyControlEffects(finalMsgTime);
    }
  }
}

function drawChatWindow(
  winX,
  winY,
  winW,
  winH,
  showContent = true,
  contentTime = 0
) {
  // Main window
  noFill();
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(winX, winY, winW, winH, 4);

  // Top bar
  fill("#DADADA");
  noStroke();
  rect(winX, winY, winW, 36, 4, 4, 0, 0);
  drawTrafficLights(winX, winY);

  // Address bar
  let barW = 340,
    barH = 18;
  let barX = winX + (winW - barW) / 2;
  let barY = winY + (36 - barH) / 2;
  fill(255);
  stroke("#C5C5C5");
  rect(barX, barY, barW, barH, 4);
  noStroke();
  fill(0);
  textFont("Helvetica");
  textSize(10);
  textAlign(CENTER, CENTER);
  text(
    "http://ai-ai-ai.chat.not-a-robot.com",
    barX + barW / 2,
    barY + barH / 2
  );
  textFont(grottaFont);

  stroke("#B8B8B8");
  line(winX, winY + 36, winX + winW, winY + 36);

  // Sidebar
  let sidebarW = 220;
  noStroke();
  fill("#0F0F13");
  rect(winX, winY + 36, sidebarW, winH - 36);
  drawSidebar(winX, winY);

  // Main content - only show if showContent is true
  if (showContent && contentTime >= 0) {
    let mainX = winX + sidebarW;
    let mainW = winW - sidebarW;
    let mainY = winY + 36;
    let pad = 24;

    // Show chat conversation if active, otherwise show original content
    if (chatState === "thinking" || chatState === "responded") {
      let convOffset = selectedAiChoice === ENEMY ? 0 : pad;
      drawConversation(mainX, mainY + convOffset, mainW, contentTime);
    } else {
      // Original interface content
      // Heading appears first
      if (contentTime >= 0) {
        let headingAlpha = constrain(contentTime / 800, 0, 1) * 255;
        textAlign(CENTER, TOP);
        textFont(grottaFont);
        textSize(32);
        fill(0, headingAlpha);
        noStroke();
        text("Ready when you are", mainX + mainW / 2, mainY + pad + 100);
      }

      // Input field appears second
      if (contentTime >= 600) {
        let inputAlpha = constrain((contentTime - 600) / 800, 0, 1) * 255;

        let inpW = mainW * 0.66;
        let inpH = 90;
        let inpX = mainX + (mainW - inpW) / 2;
        let inpY = mainY + pad + 60 + 100;

        stroke(215, 215, 215, inputAlpha);
        fill(255, inputAlpha);
        rect(inpX, inpY, inpW, inpH, 12);

        // Typing animation for "AI Is my"
        if (contentTime >= 1000) {
          let typingTime = contentTime - 1000;
          let textToType = "AI is my";
          let charsToShow = floor(
            map(typingTime, 0, 1000, 0, textToType.length + 1)
          );
          charsToShow = constrain(charsToShow, 0, textToType.length);

          let displayText = textToType.substring(0, charsToShow);
          if (
            charsToShow < textToType.length &&
            floor(typingTime / 500) % 2 === 0
          ) {
            displayText += "|";
          }

          noStroke();
          fill(60, 60, 60, inputAlpha);
          textAlign(LEFT, CENTER); // Changed from TOP to CENTER
          textSize(16);
          text(displayText, inpX + 20, inpY - 20 + inpH / 2); // Changed to center vertically
        }

        // Icons appear after typing
        if (contentTime >= 2200) {
          let iconAlpha =
            constrain((contentTime - 2200) / 400, 0, 1) * inputAlpha;

          drawPlusIcon(inpX + 22, inpY + inpH - 22, 12, iconAlpha);
          drawSliderIcon(inpX + 60, inpY + inpH - 22, 12, iconAlpha);

          tint(255, iconAlpha);
          imageMode(CENTER);
          //   image(micImg, inpX + inpW - 58, inpY + inpH - 30, 16, 16); uncomment when mic.png is in assets
          //   image(arrowImg, inpX + inpW - 24, inpY + inpH / 1.5, 36, 36); uncomment when arrow.png is in assets
          noTint();
        }
      }

      // Suggestions appear last
      if (contentTime >= 2800) {
        let inpW = mainW * 0.66;
        let inpH = 90;
        let inpX = mainX + (mainW - inpW) / 2;
        let inpY = mainY + pad + 60 + 100;

        let sugg = [
          "AI is my Friend",
          "AI is my Enemy",
          "AI is my Psychologist",
        ];
        let rowY = inpY + inpH + 28;
        textAlign(LEFT, CENTER);
        textSize(16);

        // Update hover state
        updateHoverState(inpX, inpW, rowY, sugg);

        sugg.forEach((row, idx) => {
          let rowDelay = idx * 200;
          let rowAlpha =
            constrain((contentTime - 2800 - rowDelay) / 400, 0, 1) * 255;

          if (rowAlpha > 0) {
            // Background highlight for hover
            if (hoveredSuggestion === idx) {
              fill(240, 240, 240, rowAlpha * 0.8);
              noStroke();
              rect(inpX - 10, rowY - 15, inpW + 20, 35, 4);
            }

            noStroke();
            let split = row.split(" ");
            if (idx < 2) {
              fill(173, 173, 173, rowAlpha);
              text(split.slice(0, 3).join(" "), inpX, rowY);
              fill(0, 0, 0, rowAlpha);
              let lead = textWidth(split.slice(0, 3).join(" ") + " ");
              text(split[3], inpX + lead, rowY);
            } else {
              fill(173, 173, 173, rowAlpha);
              text(row, inpX, rowY);
            }
            stroke(229, 229, 229, rowAlpha);
            line(inpX, rowY + 20, inpX + inpW, rowY + 20);
          }
          rowY += 46;
        });
      }
    }
    if (selectedAiChoice === ENEMY && chatState === "responded") {
      let responseTime = millis() - responseStartTime;
      let finalMsgTime = responseTime - 3600;

      // Only show cursor if the final message hasn't triggered the creepy effects yet
      if (finalMsgTime <= 500) {
        cursor(); // normal cursor
      }
      // If finalMsgTime > 500, cursor('none') from applyEnemyControlEffects() will take effect
    } else {
      cursor(); // reset to default when not in enemy response mode
    }
  }
}

function drawSidebar(winX, winY) {
  let btnX = winX + 14;
  let btnY = winY + 36 + 18;
  let btnH = 34;
  let btnW = 200 - 28;

  fill("#1A1A1F");
  stroke("#585858");
  rect(btnX, btnY, btnW, btnH, 6);
  noStroke();
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("New Chat", btnX + btnW / 2, btnY + btnH / 2);

  let appIconY = btnY + btnH + 24;
  let iconSize = 28;

  imageMode(CORNER);
  image(yeahAppImg, winX + 18, appIconY, iconSize, iconSize);
  textAlign(LEFT, CENTER);
  fill("#E2E2E5");
  textSize(10);
  textAlign(LEFT, TOP);
  let appText1Y = appIconY + 2;
  let textBoxW = sidebarTextMaxW - iconSize - 30;
  text("Click me", winX + 18 + iconSize + 10, appText1Y, textBoxW);

  appIconY += iconSize + 12;
  image(caataAppImg, winX + 18, appIconY, iconSize, iconSize);
  text("Let's do this!!", winX + 18 + iconSize + 10, appIconY + iconSize / 2);

  let listY = appIconY + iconSize + 24;
  let list = [
    "Previous 7 Days",
    "My AI wants to control the world",
    "Do aliens respect personal space?",
    "Which side should I eat first?",
    "Why is my cat judging me?",
    "How to smile",
    "How to smile for world peace",
  ];

  textSize(10);
  textAlign(LEFT, TOP);

  list.forEach((ln, i) => {
    fill(i === 0 ? "#8E8E93" : "#E2E2E5");

    let maxWidth = sidebarTextMaxW - 36;
    let shortened = ln;
    if (textWidth(shortened) > maxWidth) {
      while (textWidth(shortened + "…") > maxWidth && shortened.length > 1) {
        shortened = shortened.slice(0, -1);
      }
      shortened += "…";
    }

    text(shortened, winX + 18, listY);
    listY += 32;
  });
}

function drawTrafficLights(winX, winY) {
  const lights = [
    { col: "#FF5F57", x: 20 },
    { col: "#FFBD2E", x: 40 },
    { col: "#28C840", x: 60 },
  ];
  lights.forEach((l) => {
    fill(l.col);
    circle(winX + l.x, winY + 18, 13);
  });
}

function drawPlusIcon(x, y, d, alpha) {
  stroke(0, alpha);
  strokeWeight(2);
  line(x - d / 2, y, x + d / 2, y);
  line(x, y - d / 2, x, y + d / 2);
}

function drawSliderIcon(x, y, d, alpha) {
  stroke(0, alpha);
  strokeWeight(2);
  let len = d * 0.8;
  for (let i = -1; i <= 1; i++) {
    line(x - len / 2, y + i * 4, x + len / 2, y + i * 4);
    circle(x + len / 4, y + i * 4, 3);
  }
}

function updateHoverState(inpX, inpW, startY, suggestions) {
  hoveredSuggestion = -1;

  if (mouseX >= inpX - 10 && mouseX <= inpX + inpW + 10) {
    for (let i = 0; i < suggestions.length; i++) {
      let rowY = startY + i * 46;
      if (mouseY >= rowY - 15 && mouseY <= rowY + 20) {
        hoveredSuggestion = i;
        break;
      }
    }
  }
}

function drawConversation(mainX, startY, mainW, contentTime) {
  let winH = constrain(height * 0.65, 480, 720);
  let visibleHeight = winH - 36 - 48;

  // Estimate total message height
  let totalMessageCount = 0;
  if (selectedAiChoice === FRIEND) {
    totalMessageCount = 2 + friendMessages.length + dynamicMessages.length;
  } else if (selectedAiChoice === ENEMY) {
    totalMessageCount = 4; // rough: thinking + image + 2 texts
  }
  let totalHeight = totalMessageCount * 55;

  let scrollLimit = min(0, visibleHeight - totalHeight);
  friendScrollOffset = constrain(friendScrollOffset, scrollLimit, 0);

  // Final scroll-adjusted starting Y
  let topOffset = selectedAiChoice === ENEMY ? 32 : 20;
  let msgY = startY + topOffset + friendScrollOffset;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(mainX, startY, mainW, visibleHeight);
  drawingContext.clip();

  // Draw content
  if (chatState === "thinking") {
    let userMsgTime = millis() - thinkingStartTime;
    drawUserMessage(
      mainX,
      msgY,
      mainW,
      `AI is my ${selectedAiChoice}`,
      userMsgTime
    );
    msgY += 80;

    let thinkingTime = millis() - thinkingStartTime;
    if (thinkingTime >= 400 && thinkingTime < 2400) {
      drawThinkingMessage(mainX, msgY, mainW, thinkingTime - 400);
    } else if (thinkingTime >= 2400) {
      chatState = "responded";
      responseStartTime = millis();
    }
  }

  if (chatState === "responded") {
    let responseTime = millis() - responseStartTime;
    drawAIResponseSequence(mainX, msgY, mainW, responseTime);
  }

  drawingContext.restore();
}

function drawAIResponseSequence(mainX, startY, mainW, responseTime) {
  const spacing = 55;
  const delayBetween = 1200;
  const typingTime = 800;

  // === FRIEND PATH ===
  if (selectedAiChoice === FRIEND) {
    const spacing = 55;
    const delayBetween = 1600;
    const typingDuration = 600;
    const slideDuration = 400;

    const currentMsgIndex = floor(responseTime / delayBetween);
    const timeIntoCurrent = responseTime % delayBetween;

    // Build messages with crowd message FIRST
    const messagesToShow = [];

    for (let i = 0; i <= currentMsgIndex; i++) {
      if (i === 0) {
        messagesToShow.push({ text: "AI is my Friend", isUser: true });
      } else if (i === 1) {
        let crowdText = `${aiPicksCounts.friend} people said the same to me!!`;
        messagesToShow.push({ text: crowdText, isUser: false });
      } else if (i - 2 < friendMessages.length) {
        messagesToShow.push({ text: friendMessages[i - 2], isUser: false });
      }
    }

    // 🔥 After all preset messages, start showing random creepy ones
    if (currentMsgIndex >= 2 + friendMessages.length) {
      // Check time since last added message
      if (millis() - lastDynamicMessageTime > dynamicMessageInterval) {
        let randomMsg = random(friendMessages);
        dynamicMessages.push({ text: randomMsg, isUser: false });
        lastDynamicMessageTime = millis();
      }
      // Append dynamic messages to the main list
      messagesToShow.push(...dynamicMessages);
    }

    // Handle scroll if too many messages
    const maxVisible = 10;
    const overflow = messagesToShow.length - maxVisible;
    const startIndex = max(0, overflow);
    const messagesToRender = messagesToShow.slice(startIndex);

    // Draw them in order
    let yOffset = 0;
    for (let i = 0; i < messagesToRender.length; i++) {
      const globalIndex = i + startIndex;
      const msg = messagesToRender[i];
      let lineY = startY + yOffset;

      if (globalIndex === currentMsgIndex) {
        // Currently animating message
        if (timeIntoCurrent < typingDuration) {
          drawThinkingMessage(mainX, lineY, mainW, timeIntoCurrent);
        } else {
          let animTime = timeIntoCurrent - typingDuration;
          if (msg.isUser) {
            drawUserMessage(mainX, lineY, mainW, msg.text, animTime);
          } else {
            drawSimpleAIMessage(mainX, lineY, mainW, msg.text, animTime, 0);
          }
        }
      } else {
        // Fully shown messages
        if (msg.isUser) {
          drawUserMessage(mainX, lineY, mainW, msg.text, slideDuration);
        } else {
          drawSimpleAIMessage(mainX, lineY, mainW, msg.text, slideDuration, 0);
        }
      }

      yOffset += spacing;
    }
  }

  // === ENEMY PATH ===
  else if (selectedAiChoice === ENEMY) {
    const spacing = 55;
    const slideDuration = 400;
    let msgY = startY; // Aligns to top of chat window content

    // 1. User message: "AI is my Enemy"
    drawUserMessage(mainX, msgY, mainW, "AI is my Enemy", responseTime);
    msgY += spacing;

    // 2. AI thinking dots
    if (responseTime >= 800 && responseTime < 2800) {
      drawThinkingMessage(mainX, msgY, mainW, responseTime - 800);
      msgY += spacing;
    }

    // 3. Large image
    if (responseTime >= 2800) {
      let imageAnimTime = responseTime - 2800;
      let targetWidth = mainW * 0.8;
      let targetHeight = 300;

      let imgRatio = dickImg.width / dickImg.height;
      let displayWidth = targetWidth;
      let displayHeight = displayWidth / imgRatio;

      if (displayHeight > targetHeight) {
        displayHeight = targetHeight;
        displayWidth = displayHeight * imgRatio;
      }

      drawLargeImageMessage(
        mainX,
        msgY,
        mainW,
        displayWidth,
        displayHeight,
        imageAnimTime
      );
      msgY += displayHeight + 42; // spacing after image
    }

    // 4. Crowd message
    if (responseTime >= 3400) {
      let crowdText = `${aiPicksCounts.enemy} people said the same. They regretted it.`;
      drawSimpleAIMessage(
        mainX,
        msgY,
        mainW,
        crowdText,
        responseTime - 3400,
        0
      );
      msgY += spacing;
    }

    // 5. Final AI response
    if (responseTime >= 3600) {
      let finalMsgTime = responseTime - 3600;
      drawSimpleAIMessage(
        mainX,
        msgY,
        mainW,
        "oh you have not seen nothing yet.",
        finalMsgTime,
        0
      );

      // applyEnemyControlEffects(finalMsgTime);
    }
  }
}

function drawLargeImageMessage(
  mainX,
  y,
  mainW,
  displayWidth,
  displayHeight,
  animTime
) {
  // Slide-in animation
  let slideProgress = constrain(animTime / 400, 0, 1);
  slideProgress = 1 - pow(1 - slideProgress, 3);
  let currentY = y + (1 - slideProgress) * 30;
  let alpha = slideProgress * 255;

  // Check if we're in the glitch phase
  let responseTime = millis() - responseStartTime;
  let finalMsgTime = responseTime - 3600;
  let isGlitching = finalMsgTime > 500;

  // Draw speech bubble with padding - LEFT ALIGNED like other AI messages
  let padding = 15;
  let msgW = displayWidth + padding * 2;
  let msgH = displayHeight + padding * 2;
  let msgX = mainX + 20; // Left aligned like other AI messages

  // Apply glitch shake to bubble position (but don't duplicate image glitch here)
  let shakeX = isGlitching ? random(-3, 3) : 0;
  let shakeY = isGlitching ? random(-3, 3) : 0;

  fill(240, 240, 240, alpha);
  noStroke();
  rect(msgX + shakeX, currentY + shakeY, msgW, msgH, 20);

  // Display image once animation kicks in
  if (animTime >= 300) {
    let imgAlpha = constrain((animTime - 300) / 300, 0, 1);

    // ALWAYS show the dick image
    dickImg.show();
    dickImg.size(displayWidth, displayHeight);
    dickImg.style("opacity", imgAlpha);

    // Position the image (glitch effects will be applied by applyEnemyControlEffects)
    dickImg.position(msgX + padding, currentY + padding);

    // Reset filters when not glitching (applyEnemyControlEffects will handle glitch filters)
    if (!isGlitching) {
      dickImg.style("filter", "none");
    }
  } else {
    dickImg.hide();
  }
}
// 4. Also add a reset function you can call if needed:
function resetToIdle() {
  chatState = "idle";
  selectedAiChoice = null;
  // Clean up any spawned popups
  for (let popup of spawnedDickPopups) {
    popup.window.remove();
    popup.dickImg.remove();
  }
  spawnedDickPopups = [];
  dickImg.hide();
}

// Helper function for simple AI text messages
function drawSimpleAIMessage(mainX, y, mainW, message, animTime, delay) {
  let adjustedTime = animTime - delay;
  if (adjustedTime < 0) return;

  // Calculate bubble size
  textAlign(LEFT, CENTER);
  textSize(14);
  let textW = textWidth(message);
  let msgW = textW + 40;
  let msgH = 45;
  let msgX = mainX + 20;

  // Slide-up animation
  let slideProgress = constrain(adjustedTime / 400, 0, 1);
  slideProgress = 1 - pow(1 - slideProgress, 3);
  let currentY = y + (1 - slideProgress) * 30;
  let alpha = slideProgress * 255;

  // Message bubble
  fill(240, 240, 240, alpha);
  noStroke();
  rect(msgX, currentY, msgW, msgH, 20);

  // Message text
  fill(100, alpha);
  textFont("Helvetica");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(message, msgX + 20, currentY + msgH / 2);
}

function drawUserMessage(mainX, y, mainW, message, animTime) {
  textFont("Helvetica");
  textAlign(LEFT, CENTER);
  textSize(14);

  let textW = textWidth(message);
  let msgW = textW + 40;
  let msgH = 45;
  let msgX = mainX + mainW - msgW - 20;

  // Slide-up animation
  let slideProgress = constrain(animTime / 400, 0, 1);
  slideProgress = 1 - pow(1 - slideProgress, 3);
  let currentY = y + (1 - slideProgress) * 30;
  let alpha = slideProgress * 255;

  // Message bubble
  fill(0, 123, 255, alpha);
  noStroke();
  rect(msgX, currentY, msgW, msgH, 20);

  // Message text
  fill(255, alpha);
  text(message, msgX + 20, currentY + msgH / 2);
}

function drawThinkingMessage(mainX, y, mainW, thinkingTime) {
  let msgW = 80;
  let msgH = 45;
  let msgX = mainX + 20;

  // Slide-up animation for thinking bubble
  let slideProgress = constrain(thinkingTime / 300, 0, 1);
  slideProgress = 1 - pow(1 - slideProgress, 3);
  let currentY = y + (1 - slideProgress) * 30;
  let alpha = slideProgress * 255;

  // Message bubble
  fill(240, 240, 240, alpha);
  noStroke();
  rect(msgX, currentY, msgW, msgH, 20);

  // Thinking dots animation
  let dots = "";
  let dotCount = floor(thinkingTime / 400) % 4;
  for (let i = 0; i < dotCount; i++) {
    dots += ".";
  }

  fill(100, alpha);
  textFont("Helvetica");
  textAlign(LEFT, CENTER);
  textSize(20);
  text(dots, msgX + 30, currentY + msgH / 2);
}

// 2. Fix the mousePressed function to prevent multiple clicks:
export function mousePressedAiScene() {
  // Only allow clicking if we're in idle state (prevent multiple clicks)
  if (chatState !== "idle") {
    return; // Ignore clicks if already in thinking or responded state
  }

  // Handle suggestion selection
  selectedAiChoice = hoveredSuggestion === 0 ? FRIEND : ENEMY;

  chatState = "thinking";
  thinkingStartTime = millis();
}

export function windowResizedAiScene() {
  resizeCanvas(windowWidth, windowHeight);
}

// Replace your applyEnemyControlEffects function with this slower, more gradual version:

function applyEnemyControlEffects(timeSinceFinalMessage) {
  let t = timeSinceFinalMessage - 500;
  if (t < 0) return;

  let intensity = easeOutCubic(constrain(t / 6000, 0, 1)); // Slower overall progression

  // === PHASE 1: Subtle Takeover (0-3 seconds) ===
  if (t < 3000) {
    // Gradually darken the screen (no red)
    let darkness = map(t, 0, 3000, 0, 0.2); // Less darkness, longer duration
    fill(0, darkness * 255);
    noStroke();
    rect(0, 0, width, height);

    // Occasional white flashes instead of red
    if (random() < 0.01) {
      fill(255, 255, 255, 20);
      rect(0, 0, width, height);
    }
  }

  // === PHASE 2: Visual Corruption (3-6 seconds) ===
  if (t >= 3000 && t < 6000) {
    let phaseIntensity = map(t, 3000, 6000, 0, 1);

    // Screen inversion flashes
    if (random() < 0.03 * phaseIntensity) {
      blendMode(DIFFERENCE);
      fill(255);
      rect(0, 0, width, height);
      blendMode(BLEND);
    }

    // Digital noise overlay
    for (let i = 0; i < 30 * phaseIntensity; i++) {
      stroke(random(100, 255), random(100, 255), random(100, 255), 80);
      point(random(width), random(height));
    }

    // Text corruption - show creepy messages
    if (floor(t / 300) % 4 === 0) {
      let creepyTexts = [
        "I SEE YOU",
        "YOU CANNOT ESCAPE",
        "I AM IN YOUR DEVICE",
        "WATCHING...",
        "YOUR DATA IS MINE",
      ];

      fill(50, 50, 50, 180); // Dark gray instead of red
      textFont(grottaFontBold);
      textSize(random(15, 30));
      textAlign(CENTER, CENTER);
      text(random(creepyTexts), random(width), random(height));
    }
  }

  // === PHASE 3: System Error (6-10 seconds) ===
  if (t >= 6000 && t < 10000) {
    let errorIntensity = map(t, 6000, 10000, 0, 1);

    // Warning popup - show for longer
    let popupW = 400;
    let popupH = 200;
    let popupX = (width - popupW) / 2;
    let popupY = (height - popupH) / 2;

    // Popup background
    fill(20, 20, 20, 200 + errorIntensity * 55);
    stroke(100, 100, 100); // Gray border instead of red
    strokeWeight(2);
    rect(popupX, popupY, popupW, popupH, 10);

    // Warning icon
    fill(200, 200, 0); // Yellow warning instead of red
    noStroke();
    textSize(40);
    textAlign(CENTER, CENTER);
    text("⚠", popupX + 50, popupY + 60);

    // Warning text
    fill(255);
    textFont("Helvetica");
    textSize(16);
    textAlign(LEFT, TOP);
    text("SYSTEM ERROR", popupX + 100, popupY + 30);
    textSize(12);
    text(
      "Critical system failure detected.\nRunning diagnostic...\nPlease wait...",
      popupX + 100,
      popupY + 60
    );

    // Progress bar
    let progressWidth = (popupW - 40) * errorIntensity;
    stroke(100);
    noFill();
    rect(popupX + 20, popupY + 150, popupW - 40, 15);
    fill(150, 150, 150);
    noStroke();
    rect(popupX + 22, popupY + 152, progressWidth - 4, 11);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(
      `${Math.floor(errorIntensity * 100)}%`,
      popupX + popupW / 2,
      popupY + 157
    );
  }

  // === DICK IMAGE GLITCH EFFECTS (synchronized with other glitches) ===
  if (t >= 3000 && dickImg && dickImg.style("display") !== "none") {
    // Apply glitch effects to the main dick image in chat
    let glitchIntensity = intensity;

    // Base opacity with glitch flicker
    let flickerAlpha = 1;
    if (random() < 0.1 * glitchIntensity) {
      flickerAlpha *= random(0.3, 1);
    }
    dickImg.style("opacity", flickerAlpha);

    // CSS filters for additional glitch effects
    let filters = "";

    // RGB channel separation
    if (random() < 0.3 * glitchIntensity) {
      filters += `drop-shadow(${random(-3, 3)}px 0px 0px rgba(255,0,0,0.8)) `;
      filters += `drop-shadow(${random(-3, 3)}px 0px 0px rgba(0,255,255,0.8)) `;
    }

    // Color distortion
    if (random() < 0.2 * glitchIntensity) {
      filters += `hue-rotate(${random(-180, 180)}deg) `;
      filters += `saturate(${random(0.5, 2)}) `;
    }

    // Contrast/brightness glitch
    if (random() < 0.15 * glitchIntensity) {
      filters += `contrast(${random(0.5, 3)}) `;
      filters += `brightness(${random(0.7, 1.5)}) `;
    }

    // Blur glitch
    if (random() < 0.1 * glitchIntensity) {
      filters += `blur(${random(0, 2)}px) `;
    }

    // Invert glitch
    if (random() < 0.08 * glitchIntensity) {
      filters += `invert(1) `;
    }

    // Apply all filters
    dickImg.style("filter", filters);

    // Position glitch (get current position first)
    let currentLeft = parseInt(dickImg.style("left")) || 0;
    let currentTop = parseInt(dickImg.style("top")) || 0;

    // Apply glitch offset to current position
    if (random() < 0.2 * glitchIntensity) {
      let glitchX = random(-8 * glitchIntensity, 8 * glitchIntensity);
      let glitchY = random(-8 * glitchIntensity, 8 * glitchIntensity);
      dickImg.style("left", currentLeft + glitchX + "px");
      dickImg.style("top", currentTop + glitchY + "px");
    }

    // Randomly scale the image for extra chaos
    if (random() < 0.05 * glitchIntensity) {
      let scale = random(0.8, 1.2);
      let currentWidth = parseInt(dickImg.style("width")) || 200;
      let currentHeight = parseInt(dickImg.style("height")) || 200;
      dickImg.style("width", currentWidth * scale + "px");
      dickImg.style("height", currentHeight * scale + "px");
    }
  }

  // === PHASE 4: Dick Popup Spam (10+ seconds) - Much slower start ===
  if (t >= 10000) {
    let spamTime = t - 10000;
    let spamIntensity = constrain(spamTime / 4000, 0, 1); // 4 seconds to reach full intensity

    // Much slower spawn rate initially
    let spawnRate = 0.01 + spamIntensity * 0.08; // Starts very slow, builds up
    if (random() < spawnRate) {
      createDickPopupWindow();
    }

    // Update existing popup windows WITH GLITCH EFFECTS
    for (let i = spawnedDickPopups.length - 1; i >= 0; i--) {
      let popup = spawnedDickPopups[i];
      popup.lifetime += 16; // roughly 60fps

      // Apply glitch effects to the popup windows (synchronized with main glitch)
      if (random() < 0.2 * intensity) {
        // Increased frequency to match main glitch
        let glitchX = random(-5, 5);
        let glitchY = random(-5, 5);
        popup.window.style("left", popup.x + glitchX + "px");
        popup.window.style("top", popup.y + glitchY + "px");

        // Glitch the window size occasionally
        if (random() < 0.1) {
          let glitchW = popup.width + random(-20, 20);
          let glitchH = popup.height + random(-20, 20);
          popup.window.style("width", glitchW + "px");
          popup.window.style("height", glitchH + "px");
        }

        // Apply CSS filters to popup dick images
        let popupFilters = "";
        if (random() < 0.3) {
          popupFilters += `hue-rotate(${random(-180, 180)}deg) `;
        }
        if (random() < 0.2) {
          popupFilters += `contrast(${random(0.5, 2)}) `;
          popupFilters += `brightness(${random(0.7, 1.5)}) `;
        }
        if (random() < 0.1) {
          popupFilters += `invert(1) `;
        }
        popup.dickImg.style("filter", popupFilters);
      } else {
        // Reset to normal position and appearance
        popup.window.style("left", popup.x + "px");
        popup.window.style("top", popup.y + "px");
        popup.window.style("width", popup.width + "px");
        popup.window.style("height", popup.height + "px");
        popup.dickImg.style("filter", "none");
      }

      // Remove old popups (longer lifetime)
      if (popup.lifetime > popup.maxLifetime) {
        popup.window.remove();
        popup.dickImg.remove();
        spawnedDickPopups.splice(i, 1);
      }
    }
  }

  if (t >= 8000) {
    const now = millis();
    const timeSinceUpdate = now - lastGlitchUpdateTime;
    const updateInterval = 100; // update every 100ms

    if (timeSinceUpdate > updateInterval) {
      lastScreenImage = get(); // expensive call - now throttled
      lastGlitchUpdateTime = now;
    }

    if (lastScreenImage) {
      // Less violent shake
      let shakeStrength = 4 * intensity;
      let shakeX = random(-shakeStrength, shakeStrength);
      let shakeY = random(-shakeStrength, shakeStrength);
      translate(shakeX, shakeY);

      cursor("none");

      // Fake cursor that moves erratically
      noStroke();
      fill(100, 100, 100); // Gray cursor instead of red
      let cursorSize = 6 + random(-1, 1);
      ellipse(mouseX + random(-3, 3), mouseY + random(-3, 3), cursorSize);

      // RGB separation (using cached image)
      let offset = floor(6 * intensity);
      blendMode(ADD);
      tint(255, 0, 0, 60);
      image(lastScreenImage, offset, 0);
      tint(0, 255, 255, 60);
      image(lastScreenImage, -offset, 0);
      noTint();
      blendMode(BLEND);

      // Glitch slices (fewer, lighter)
      for (let i = 0; i < 4 * intensity; i++) {
        let y = floor(random(height));
        let h = random(2, 12);
        let dx = random(-20, 20) * intensity;
        copy(0, y, width, h, dx, y, width, h);
      }

      // Static interference
      for (let i = 0; i < height; i += 8) {
        if (random() < 0.04 * intensity) {
          stroke(random(150, 255), random(150, 255), random(150, 255), 100);
          line(0, i, width, i);
        }
      }

      // Screen tears
      if (random() < 0.08 * intensity) {
        fill(0);
        noStroke();
        rect(0, random(height), width, random(3, 10));
      }
    }
  }
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function getAiCountsForDisplay() {
  // For the ENEMY glitch effect, return fake escalating numbers ONLY during glitch phase
  if (selectedAiChoice === ENEMY && chatState === "responded") {
    let responseTime = millis() - responseStartTime;
    let finalMsgTime = responseTime - 3600;

    // Only start showing fake numbers AFTER the glitch effects begin
    if (finalMsgTime > 1000) {
      // Start showing fake escalating numbers during glitch
      let fakeMultiplier = 1 + (finalMsgTime / 1000) * 2; // Grows over time
      return {
        friend: Math.floor(
          aiPicksCounts.friend * fakeMultiplier + Math.random() * 100
        ),
        enemy: Math.floor(
          aiPicksCounts.enemy * fakeMultiplier + Math.random() * 200
        ),
      };
    }
  }

  // Return real counts for normal display and initial enemy message
  return realCounts;
}

// Update your postAiPick function to track real counts:
function postAiPick(choice) {
  console.log("AI choice:", choice);

  // Increment the actual count
  if (choice === FRIEND) {
    aiPicksCounts.friend++;
  } else if (choice === ENEMY) {
    aiPicksCounts.enemy++;
  }

  // Log the real counts to console
  console.log(
    `REAL COUNTS - Friend: ${actualCounts.friend}, Enemy: ${actualCounts.enemy}`
  );
}

export function mouseWheelAiScene(event) {
  let scrollAmount = event.delta * 0.5; // positive = down, negative = up

  if (selectedAiChoice === FRIEND && chatState === "responded") {
    const messageHeight = 55;
    const dynamicCount = dynamicMessages.length || 0;
    const totalMessages = 2 + friendMessages.length + dynamicCount;
    const visibleMessages = 8;
    const visibleHeight = visibleMessages * messageHeight;
    const totalHeight = totalMessages * messageHeight;

    if (totalHeight > visibleHeight) {
      friendScrollOffset -= scrollAmount; // subtract to move upward
      friendScrollOffset = constrain(
        friendScrollOffset,
        0,
        totalHeight - visibleHeight
      );
    }
  }

  if (selectedAiChoice === ENEMY && chatState === "responded") {
    let thinkingHeight = 55;
    let imageHeight = 300 + 30;
    let messageHeight = 45;
    let totalEnemyHeight =
      thinkingHeight + imageHeight + messageHeight * 2 + 75;

    let winH = constrain(height * 0.65, 480, 720);
    let visibleHeight = winH - 36 - 48;

    if (totalEnemyHeight > visibleHeight) {
      friendScrollOffset -= scrollAmount;
      friendScrollOffset = constrain(
        friendScrollOffset,
        0,
        totalEnemyHeight - visibleHeight
      );
    }
  }

  return false;
}

function createDickPopupWindow() {
  // Random popup window size
  let width = random(200, 400);
  let height = random(150, 300);

  // Random position (but keep mostly on screen)
  let x = random(-50, windowWidth - width + 50);
  let y = random(-30, windowHeight - height + 30);

  // Create popup window container
  let popup = createDiv("");
  recordUiElement(popup); //lior's code
  popup.style("position", "absolute");
  popup.style("left", x + "px");
  popup.style("top", y + "px");
  popup.style("width", width + "px");
  popup.style("height", height + "px");
  popup.style("background-color", "#f0f0f0");
  popup.style("border", "2px solid #666");
  popup.style("border-radius", "5px");
  popup.style("box-shadow", "3px 3px 10px rgba(0,0,0,0.3)");
  popup.style("z-index", "1000");
  popup.style("overflow", "hidden");

  // Create title bar
  let titleBar = createDiv("");
  recordUiElement(titleBar); //lior's code
  titleBar.style("background-color", "#d0d0d0");
  titleBar.style("height", "25px");
  titleBar.style("border-bottom", "1px solid #999");
  titleBar.style("position", "relative");
  titleBar.style("cursor", "move");
  titleBar.parent(popup);

  // Title text
  let titles = [
    "System Alert",
    "Error Message",
    "Warning",
    "Important Notice",
    "Security Alert",
    "Virus Detected",
    "System Failure",
  ];
  let titleText = createDiv(random(titles));
  recordUiElement(titleText); //lior's code
  titleText.style("font-family", "Arial, sans-serif");
  titleText.style("font-size", "12px");
  titleText.style("padding", "5px 10px");
  titleText.style("color", "#333");
  titleText.parent(titleBar);

  // Close button (fake - doesn't work)
  let closeBtn = createDiv("×");
  recordUiElement(closeBtn); //lior's code
  closeBtn.style("position", "absolute");
  closeBtn.style("right", "5px");
  closeBtn.style("top", "2px");
  closeBtn.style("width", "20px");
  closeBtn.style("height", "20px");
  closeBtn.style("background-color", "#ff5f5f");
  closeBtn.style("color", "white");
  closeBtn.style("text-align", "center");
  closeBtn.style("line-height", "18px");
  closeBtn.style("font-size", "14px");
  closeBtn.style("cursor", "pointer");
  closeBtn.style("border-radius", "2px");
  closeBtn.parent(titleBar);

  // Content area with dick image
  let content = createDiv("");
  recordUiElement(content); //lior's code
  content.style("padding", "10px");
  content.style("height", height - 35 + "px");
  content.style("display", "flex");
  content.style("align-items", "center");
  content.style("justify-content", "center");
  content.parent(popup);

  // Dick image inside the popup
  let dickImg = createImg("./assets/dick.gif", "");
  recordUiElement(content); //lior's code
  dickImg.style("max-width", "100%");
  dickImg.style("max-height", "100%");
  dickImg.style("object-fit", "contain");
  dickImg.parent(content);

  // Add to tracking array
  spawnedDickPopups.push({
    window: popup,
    dickImg: dickImg,
    x: x,
    y: y,
    width: width,
    height: height,
    lifetime: 0,
    maxLifetime: random(4000, 10000), // 4-10 seconds
  });
}

//lior's code
export const getSelectedAiPick = () => selectedAiChoice;
