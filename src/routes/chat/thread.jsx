import { Box } from "@mui/system";
import { IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { markThreadAsRead, socket } from '../../api/socket'
import { getThread } from "../../api/chat";

function ChatBubble({ incoming, message }) {
    const adjacentSibling = `& + .${incoming ? 'outgoing-chat' : 'incoming-chat'}`;

    return (
        <Box
            className={incoming ? 'incoming-chat' : 'outgoing-chat'} sx={{
                px: 3,
                py: 1.5,
                background: incoming ? '#DDDDDD' : '#6E42CC',
                display: 'inline-block',
                borderRadius: 1,
                flexShrink: 1,
                alignSelf: incoming ? 'flex-start' : 'flex-end',
                mr: incoming ? 8 : 0,
                ml: incoming ? 0 : 8,
                [adjacentSibling]: {
                    mt: 2
                }
            }}>
            <Typography variant="body2" color={incoming ? "#2B2B2B" : "#fff"}>{message}</Typography>
        </Box>
    )
}

export default function ChatThread() {
    const sender = localStorage.getItem('username') // current user

    const { threadId } = useParams()
    const [recipient, setRecipient] = useState('') // recipient user

    const location = useLocation()
    const [message, setMessage] = useState('')

    const [thread, setThread] = useState([])
    const threadRef = useRef()
    const handleSendMessage = () => {
        setThread((t) => [...t, { incoming: false, message }])
        setMessage('')
        socket.emit('chat', { sender, recipient, message })
    }

    const scrollToBottom = () => {
        threadRef.current.scrollTop = threadRef.current.scrollHeight
    }

    useEffect(() => {
        scrollToBottom()
    }, [thread])

    useEffect(() => {
        // Start of a new conversation
        if (location.state && thread.length == 0) {
            setThread((t) => [...t, { incoming: false, message: location.state.initialMessage }])
            window.history.replaceState({}, document.title) // clear the location state after consuming the initial message
        }

        return () => {
            setThread([])
        }
    }, [])

    // Fetch Thread Data
    useEffect(() => {
        (async function () {
            const t = await getThread(sender, threadId)
            setThread(t.messages)
            setRecipient(t.recipient)
        })()
    }, [])

    useEffect(() => {
        socket.on(`chat::${recipient}:${sender}`, (message) => {
            setThread((t) => [...t, { incoming: true, message, recipient: sender }])
            markThreadAsRead(threadId, sender)
        })

        return () => {
            socket.off(`chat::${recipient}:${sender}`)
        }
    }, [recipient])

    return (
        <>
            <Box p={4} display="flex" alignItems="center" gap={2} sx={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                zIndex: 100
            }}>
                <IconButton aria-label="back" color="purple" component={Link} href="/chat">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" flex={1}>@{recipient}</Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={1} px={4} py={2} sx={{
                height: 'calc(100vh - 176px)',
                overflowY: 'scroll',
                zIndex: 0,
            }} ref={threadRef}>
                {
                    thread.map(({ message, recipient }, i) => (
                        <ChatBubble key={i} incoming={sender == recipient} message={message} />
                    ))
                }
            </Box>


            <Box display="flex" alignItems="center" gap={2} sx={{
                px: 4,
                py: 2,
                width: '100%',
                background: '#f0f0f0',
                position: 'absolute',
                bottom: 0,
            }}>
                <TextField
                    variant="standard"
                    sx={{ flex: 1 }}
                    color="purple"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage()
                        }
                    }}
                />
                <IconButton aria-label="send" color="purple" disabled={message.length === 0} onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
            </Box>
        </>
    )
}