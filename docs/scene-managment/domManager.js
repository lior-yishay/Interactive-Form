let uiElements = [];

export const recordDomElement = (element) => uiElements.push(element);

export const clearDomElements = () => {
  uiElements.forEach((el) => el.remove());
  uiElements = [];
};
