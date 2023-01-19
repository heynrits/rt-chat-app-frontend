import { Box } from "@mui/system";
import { IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from '../../api/socket'

export default function NewChat() {
    const navigate = useNavigate()

    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')

    const sendDisabled = recipient.length === 0 || message.length === 0

    const sender = localStorage.getItem('username') // current user
    const handleSendMessage = () => {
        socket.emit('chat', { sender, recipient, message })
    }

    useEffect(() => {
        socket.on(`chat init::${sender}:${recipient}`, (threadId) => {
            navigate(`/chat/t/${threadId}`)
        })

        return () => {
            socket.off(`chat init::${sender}:${recipient}`)
        }
    }, [recipient])

    return (
        <>
            <Box px={4} pt={2} pb={4} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                <IconButton aria-label="back" color="purple" component={Link} href="/chat">
                    <ArrowBackIcon />
                </IconButton>
                <TextField
                    variant="standard"
                    color="purple"
                    label="Recipient"
                    fullWidth
                    sx={{ mt: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                @
                            </InputAdornment>
                        )
                    }}
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </Box>
            <Box sx={{ height: 'calc(100vh - 216px)', position: 'relative'}}>
            <Typography variant="subtitle2" sx={{
                color: '#888',
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>Enter a username and send your first message to start chatting!</Typography>
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
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage()
                        }
                    }}
                />
                <IconButton onClick={handleSendMessage} aria-label="send" color="purple" disabled={sendDisabled}>
                    <SendIcon />
                </IconButton>
            </Box>
        </>
    )
}