export const drawTextWithColonFont = (textStr, mainFont, altFont, x, y) => {
  const parts = textStr.split(":");
  let currX = x;
  for (let i = 0; i < parts.length; i++) {
    textFont(mainFont);
    text(parts[i], currX, y);
    currX += textWidth(parts[i]);
    if (i < parts.length - 1) {
      textFont(altFont);
      text(":", currX, y);
      currX += textWidth(":");
    }
  }
};
