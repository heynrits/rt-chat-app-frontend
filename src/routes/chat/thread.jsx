import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from "react";
import { useLoaderData, useLocation, useOutletContext, useParams } from "react-router-dom";
import { debounce } from "lodash"
import { motion } from "framer-motion"
import { Box } from "@mui/system";
import { CircularProgress, IconButton, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

import { markThreadAsRead, socket } from '../../api/socket'
import { getThread } from "../../api/chat";

const ChatBubble = React.forwardRef(({ incoming, message }, ref) => {
    const adjacentSibling = `& + .${incoming ? 'outgoing-chat' : 'incoming-chat'}`;

    return (
        <Box
            ref={ref}
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
})

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
    const initialThread = useLoaderData()
    const sender = localStorage.getItem('username') // current user
    const [updateChats] = useOutletContext()

    const { threadId } = useParams()
    const [recipient, setRecipient] = useState('') // recipient user

    const location = useLocation()
    const [message, setMessage] = useState('')

    // Pagination
    const [pageNumber, setPageNumber] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [loading, setLoading] = useState(false)

    const [thread, setThread] = useState([])
    const threadRef = useRef()
    const typingIndicatorRef = useRef()

    // This watches if the top-most message bubble becomes visible in the viewport.
    // If it is, it increments the pageNumber so that the Fetch Thread Data side effect
    // updates the thread content with the next set of messages in the conversation
    const observer = useRef()
    const topMessageBubbleRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNext) {
                setLoading(true)
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasNext])

    const handleSendMessage = () => {
        setThread((t) => [{ incoming: false, message }, ...t])
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
        setPageNumber(1)
        setThread(initialThread.messages)
        setRecipient(initialThread.recipient)
        setHasNext(initialThread.hasNext)
        scrollToBottom()

        return () => {
            setThread([])
        }
    }, [initialThread])

    // Fetch Thread Data
    useEffect(() => {
        (async function (page) {
            if (pageNumber > 1) {
                const t = await getThread(sender, threadId, { page })
                setThread((prevThread) => [...prevThread, ...t.messages])
                setRecipient(t.recipient)
                setHasNext(t.hasNext)
                setLoading(false)
            }
        })(pageNumber)
    }, [pageNumber])

    // Only executes 3 seconds after the last call to the debounced function
    const hideTypingIndicator = debounce(() => {
        typingIndicatorRef.current.classList.add('hidden')
    }, 3000)

    useEffect(() => {
        socket.on(`chat::${recipient}:${sender}`, (message) => {
            setThread((t) => [{ incoming: true, message, recipient: sender }, ...t])
            markThreadAsRead(threadId, sender)
            hideTypingIndicator.flush()
        })

        socket.on(`chat:sent::${sender}:${recipient}`, () => {
            updateChats()
        })

        socket.on(`chat:typing::${threadId}:${recipient}`, () => {
            typingIndicatorRef.current.classList.remove('hidden')
            scrollToBottom()
            hideTypingIndicator()
        })

        return () => {
            socket.off(`chat::${recipient}:${sender}`)
            socket.off(`chat:sent::${sender}:${recipient}`)
            socket.off(`chat:typing::${threadId}:${recipient}`)
        }
    }, [recipient])

    return (
        <>
            <Box px={4} py={2} display="flex" alignItems="center" gap={2} sx={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                zIndex: 100
            }}>
                <IconButton aria-label="back" color="purple" component={Link} href="/chat">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" flex={1}>@{recipient}</Typography>
            </Box>

            <Box display="flex" flexDirection="column-reverse" gap={1} px={4} py={2} sx={{
                height: 'calc(100vh - 144px)',
                overflowY: 'scroll',
                zIndex: 0,
            }} ref={threadRef}>
                <TypingIndicator ref={typingIndicatorRef} />

                {
                    thread.map(({ message, recipient }, i) => {
                        if (thread.length == i + 1) {
                            return <ChatBubble ref={topMessageBubbleRef} key={i} incoming={sender == recipient} message={message} />
                        } else {
                            return <ChatBubble key={i} incoming={sender == recipient} message={message} />
                        }
                    })
                }

                {
                    loading ? <CircularProgress color="purple" sx={{ alignSelf: 'center' }} /> : null
                }
            </Box>

            <Box display="flex" alignItems="center" gap={2} sx={{
                px: 4,
                py: 2,
                width: '100%',
                background: '#f0f0f0',
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