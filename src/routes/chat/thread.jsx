import * as React from 'react'
import { Box } from "@mui/system";
import { IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { debounce } from "lodash"
import { markThreadAsRead, socket } from '../../api/socket'
import { getThread } from "../../api/chat";
import { motion } from "framer-motion"

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

const TypingIndicator = React.forwardRef((props, ref) => (
    <Box ref={ref} className="hidden" sx={{
        px: 3,
        py: 1.5,
        background: '#DDDDDD',
        display: 'inline-block',
        borderRadius: 1,
        flexShrink: 1,
        alignSelf: 'flex-start',
        mr: 8,
        ml: 0,
        transition: 'visibility 0.3s ease-in',
        '&.hidden': {
            visibility: 'hidden',
            display: 'none'
        },
        '& + .incoming-chat': {
            mt: 2
        },
        '& .ti-dot': {
            width: 5,
            height: 5,
            borderRadius: 5,
            display: 'inline-block',
            background: '#999',
            '&:not(:last-child)': {
                mr: 0.5,
            }
        },

    }}>
        <motion.span className="ti-dot" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0, repeatDelay: 0.6, }} />
        <motion.span className="ti-dot" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3, repeatDelay: 0.6, }} />
        <motion.span className="ti-dot" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6, repeatDelay: 0.6, }} />
    </Box>
))

export default function ChatThread() {
    const sender = localStorage.getItem('username') // current user

    const { threadId } = useParams()
    const [recipient, setRecipient] = useState('') // recipient user

    const location = useLocation()
    const [message, setMessage] = useState('')

    const [thread, setThread] = useState([])
    const threadRef = useRef()
    const typingIndicatorRef = useRef()
    const handleSendMessage = () => {
        setThread((t) => [...t, { incoming: false, message }])
        setMessage('')
        socket.emit('chat', { sender, recipient, message })
    }

    function handleInputChange(e) {
        setMessage(e.target.value)
        socket.emit('chat::typing', { threadId, sender, recipient })
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

    // Only executes 3 seconds after the last call to the debounced function
    const hideTypingIndicator = debounce(() => {
        typingIndicatorRef.current.classList.add('hidden')
    }, 3000)

    useEffect(() => {
        socket.on(`chat::${recipient}:${sender}`, (message) => {
            setThread((t) => [...t, { incoming: true, message, recipient: sender }])
            markThreadAsRead(threadId, sender)
            hideTypingIndicator.flush()
        })

        socket.on(`chat:typing::${threadId}:${recipient}`, () => {
            typingIndicatorRef.current.classList.remove('hidden')
            scrollToBottom()
            hideTypingIndicator()
        })

        return () => {
            socket.off(`chat::${recipient}:${sender}`)
            socket.off(`chat:typing::${threadId}`)
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

                <TypingIndicator ref={typingIndicatorRef} />
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
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && message.length) {
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