export const imageToBase64 = (image) => {
  const canvas = createGraphics(image.width, image.height);
  canvas.image(image, 0, 0);
  const base64 = canvas.elt.toDataURL("image/jpeg", 0.2); // gets base64 string
  return base64;
};

export const isLocal = window.location.hostname === "127.0.0.1";
