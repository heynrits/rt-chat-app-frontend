import axios from 'axios'

export const getChats = async (user) => {
    const response = await axios.get(`/threads?user=${user}`)
    return response.data
}

export const getThread = async (user, threadId, { page }) => {
    const response = await axios.get(`/threads/${threadId}?user=${user}&page=${page}`)
    return response.data
}