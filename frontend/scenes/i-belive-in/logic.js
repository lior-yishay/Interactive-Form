export const answers = {
    name: undefined,
    genders: undefined,
    age: undefined,
    livingHere: undefined,
    politics: undefined,
    iceCreamSandwich: undefined,
    smile: undefined,
    ai: undefined,
    //continue 
}

export const setSceneAnswer = (sceneName, value) => {
    answers[sceneName] = value
} 

export const getSceneAnswer = (sceneName) => {
    return answers[sceneName]
}