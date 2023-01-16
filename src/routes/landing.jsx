import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import { Button, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const hasUser = localStorage.getItem('username')
    
        if (hasUser) {
            navigate('/chat')
        }
    }, [])

    const handleClickEnter = () => {
        const username = document.getElementById('username').value

        if (username.length == 0) {
            alert('Please enter a username!')
            return
        }

        localStorage.setItem('username', username);
        navigate('/chat')
    }

    return (
        <Box display="flex" alignItems="center" flexDirection="column" width="100%" sx={{
            height: '100vh',
            px: 4,
            justifyContent: 'center'
        }}>
            <Typography variant='h3' pb={10} textAlign="center">Welcome to Chat!</Typography>
            <Typography variant='body1'>Enter a username:</Typography>
            <TextField
                id="username"
                variant="standard"
                color="purple"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            @
                        </InputAdornment>
                    )
                }}
            />
            <Button variant='contained' color="purple" fullWidth sx={{ mt: 2, p: 1.5, color: 'white' }} onClick={handleClickEnter}>Enter</Button>
        </Box>
    )
}