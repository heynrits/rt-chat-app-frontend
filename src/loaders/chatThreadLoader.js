import { getThread } from "../api/chat"

const chatThreadLoader = async ({ params }) => {
    const user = localStorage.getItem('username')

    return getThread(user, params.threadId, { page: 1 })
}

export default chatThreadLoader