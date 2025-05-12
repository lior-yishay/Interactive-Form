const URL_PREFIX = 'http://localhost:8000/api/'

export const get = async (sceneName) => {
    try {
        const res = await axios.get(`${URL_PREFIX}${sceneName}`)
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