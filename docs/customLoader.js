export const customizeP5Loader = () => {
  const loader = document.querySelector("#p5_loading");
  if (loader) {
    loader.innerHTML = '<div>Loading<span class="dots"></span></div>';
    return true;
  }
  return false;
};
