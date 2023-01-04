import axios from 'axios'

export const getChats = async (user) => {
    const response = await axios.get(`/threads?user=${user}`)
    return response.data
}