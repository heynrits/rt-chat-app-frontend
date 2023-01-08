import { io } from "socket.io-client"

export const socket = io(import.meta.env.VITE_WS_URI)

export function markThreadAsRead(threadId, user) {
    socket.emit('chat::read', { threadId, user })
}