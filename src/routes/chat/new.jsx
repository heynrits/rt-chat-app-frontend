import { Box } from "@mui/system";
import { IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";

export default function NewChat() {

    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')

    const sendDisabled = recipient.length === 0 || message.length === 0

    return (
        <>
            <Box p={4}>
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
            <Typography variant="subtitle2" sx={{
                color: '#888',
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>Enter a username and send your first message to start chatting!</Typography>
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
                />
                <IconButton aria-label="send" color="purple" disabled={sendDisabled}>
                    <SendIcon />
                </IconButton>
            </Box>
        </>
    )
}