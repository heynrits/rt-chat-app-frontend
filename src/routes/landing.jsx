import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import { deepPurple } from '@mui/material/colors'
import { Button, InputAdornment, SvgIcon } from '@mui/material'
import { ReactComponent as MessageIcon } from '../assets/icons8-messages-150.svg'

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Welcome to Chat!'
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
            justifyContent: 'center',
            backgroundColor: deepPurple[500],
        }}>
            {/* Icon, Welcome Text */}
            <motion.div
                initial={{ opacity: 1, scale: 0, translateY: 100 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ duration: 1.5, ease: 'circOut' }}
            >
                <SvgIcon
                    inheritViewBox
                    component={MessageIcon}
                    sx={{ fontSize: 100, color: '#fff' }}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: 'circOut' }}
            >
                <Typography variant='h5' component='div' pb={10} color={deepPurple[50]} textAlign="center">Welcome to Chat!</Typography>
            </motion.div>

            {/* Login Form */}
            <motion.div
                initial={{ translateY: -50 }}
                animate={{ translateY: 0 }}
                transition={{ duration: 1.5, ease: 'circOut' }}
                style={{
                    width: '100%',
                    maxWidth: 500,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                <Typography mb={1} variant='body1' color={deepPurple[50]}>Enter a username:</Typography>
                <TextField
                    label="Your username"
                    sx={{
                        '.MuiFilledInput-root': {
                            background: deepPurple[200],
                            color: 'white'
                        },
                    }}
                    id="username"
                    variant="filled"
                    color="white"
                    // sx={{ color: deepPurple[50] }}
                    fullWidth
                    InputProps={{
                        style: { color: 'white' },
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography style={{ color: '#fff' }}>@</Typography>
                            </InputAdornment>
                        )
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleClickEnter()
                        }
                    }}
                />
                <Button variant='contained' color="white" fullWidth sx={{ mt: 2, p: 1.5, color: deepPurple[500], fontWeight: 700 }} onClick={handleClickEnter}>Enter</Button>
            </motion.div>
        </Box>
    )
}