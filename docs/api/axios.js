const URL_PREFIX = 'https://interactive-form.onrender.com/api/'

export const get = async (sceneName, sendingData) => {
    try {
        const res = await axios.get(`${URL_PREFIX}${sceneName}`, {params: sendingData})
        console.log('Recived:', res.data)
        return res.data
    }
    catch (error) {
        console.error(`Get Error:`, error)
    }
}

export const post = async (sceneName, sendingData) => {
    try {
        await axios.post(`${URL_PREFIX}${sceneName}`, sendingData)
    }
    catch (error) {
        console.error(`POST Error:`, error)
    }
}