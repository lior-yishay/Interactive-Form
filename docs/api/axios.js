const isLocal = window.location.hostname === "127.0.0.1";

export const URL_PREFIX = isLocal
  ? "http://localhost:3000/api/"
  : "https://interactive-form.onrender.com/api/";

export const get = async (sceneName, sendingData) => {
  try {
    const res = await axios.get(`${URL_PREFIX}${sceneName}`, {
      params: sendingData,
    });
    console.log("Recived:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Get Error:`, error);
  }
};

export const post = async (sceneName, sendingData) => {
  try {
    const res = await axios.post(`${URL_PREFIX}${sceneName}`, sendingData);
    console.log("Response:", res);
    return res.data;
  } catch (error) {
    console.error(`POST Error:`, error);
  }
};
