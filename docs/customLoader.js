export const setupCustomLoader = () => {
  const interval = setInterval(() => {
    if (customizeP5Loader()) {
      clearInterval(interval);
    }
  }, 50);
};

const customizeP5Loader = () => {
  const loader = document.querySelector("#p5_loading");
  if (loader) {
    loader.innerHTML = `<div id="minimal-loader">Loading</div>`;
    return true;
  }
  return false;
};
