import { Fab, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from "react";
import { getChats } from "../../api/chat";
import { useState } from "react";
import { socket } from "../../api/socket";

function ChatListItem({ username, message, unread }) {
    return (
        <Box display="flex" alignItems="center" gap={2} p={1} component={Link} href={`/chat/t/${username}`} sx={{
            borderRadius: 1,
            textDecoration: 'none',
            '&:hover': {
                background: '#eae6f2'
            }
        }}>
            <Box sx={{ width: 50, height: 50, background: '#d9d9d9', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
                <PersonIcon sx={{ color: '#6E42CC' }} />
            </Box>
            <Box flex={1}>
                <Typography variant="body2" fontWeight={unread ? 700 : 400} color={unread ? '#181818' : '#434343'}>@{username}</Typography>
                <Typography variant="body2" fontWeight={unread ? 700 : 400} color={unread ? '#181818' : '#5a5a5a'}>{message}</Typography>
            </Box>
        </Box>
    )
}

export default function Chat() {
    const [chats, setChats] = useState([])

    useEffect(() => {
        (async function () {
            console.log('iife')
            const user = localStorage.getItem('username')
            const chats = await getChats(user)
            setChats(chats)
        })()
    }, [])

    const user = localStorage.getItem('username')
    useEffect(() => {
        socket.on(`new message:${user}`, () => {
            (async function () {
                console.log('iife 2')
                const chats = await getChats(user)
                setChats(chats)
            })()
        })

        return () => {
            socket.off(`new message:${user}`)
        }
    })

    return (
        <Box sx={{ px: 4 }}>
            <Typography variant='h3' py={5} textAlign="center" color="#6E42CC">Chat</Typography>

            <Box>
                {chats.length > 0 ?
                    chats.map(
                        ({ _id, recipient, lastMessage, unread }) => (
                            <ChatListItem key={_id} username={recipient} message={user === lastMessage.sender ? `You: ${lastMessage.message}` : lastMessage.message} unread={unread} />
                        )
                    )
                    :
                    <Typography variant="subtitle2" sx={{
                        color: '#888',
                        textAlign: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>Tap "+" to start chatting!</Typography>
                }

            </Box>

            <Fab color="purple" sx={{ position: "absolute", right: 32, bottom: 32 }} component={Link} href="/chat/new">
                <AddIcon sx={{ color: "#fff" }} />
            </Fab>
        </Box>
    )
}