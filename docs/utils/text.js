export const drawTextWithSpecialChar = (
  textStr,
  specialChar,
  mainFont,
  altFont,
  size,
  x,
  y
) => {
  textSize(size);
  const parts = textStr.split(specialChar);
  let currX = x;
  for (let i = 0; i < parts.length; i++) {
    textFont(mainFont);
    text(parts[i], currX, y);
    currX += textWidth(parts[i]);
    if (i < parts.length - 1) {
      textFont(altFont);
      text(specialChar, currX, y);
      currX += textWidth(specialChar);
    }
  }

  return currX - x;
};

export const getTextWithSpecialCharWidth = (
  textStr,
  specialChar,
  mainFont,
  altFont,
  size
) => {
  textSize(size);
  const parts = textStr.split(specialChar);
  let w = 0;
  for (let i = 0; i < parts.length; i++) {
    textFont(mainFont);
    w += textWidth(parts[i]);
    if (i < parts.length - 1) {
      textFont(altFont);
      w += textWidth(specialChar);
    }
  }

  return w;
};

export const toSentenceCase = (str) => {
  if (!str) return "";
  str = str.trim();
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};
