export const answers = {};

export const setSceneAnswer = (sceneName, value) => {
  answers[sceneName] = value;
};

export const getSceneAnswer = (sceneName) => {
  return answers[sceneName];
};
