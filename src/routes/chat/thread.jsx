import { Box } from "@mui/system";
import { IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

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
    const { username } = useParams()
    const location = useLocation()
    const recipient = username
    const [message, setMessage] = useState('')

    const messages = [
        // {
        //     incoming: false,
        //     message: 'Hi lorem ipsum!'
        // },
    ]

    const [thread, setThread] = useState(messages)
    const threadRef = useRef()
    const handleSendMessage = () => {
        setThread((t) => [...t, { incoming: false, message }])

        setMessage('')
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
            setThread((t) => [...t, { incoming: false, message: location.state.initialMessage}])
            window.history.replaceState({}, document.title) // clear the location state after consuming the initial message
        }

        return () => {
            setThread([])
        }
    }, [])

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
                    thread.map(({ incoming, message }, i) => (
                        <ChatBubble key={i} incoming={incoming} message={message} />
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