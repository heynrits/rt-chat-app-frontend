import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const hasUser = localStorage.getItem('username')
    
        if (hasUser) {
            navigate('/chat')
            return null
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
            <TextField label="@your_username" id="username" variant="standard" fullWidth />
            <Button variant='contained' fullWidth sx={{ mt: 2, p: 1.5 }} onClick={handleClickEnter}>Enter</Button>
        </Box>
    )
}