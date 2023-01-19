import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs'
import { IconButton, Link, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';

import AccountMenu from '../../components/AccountMenu';

import { getChats } from "../../api/chat";
import { socket, markThreadAsRead } from "../../api/socket";
import newMsgSound from '../../assets/new-message.mp3'

function ChatListItem({ id, username, message, unread, timestamp, onClick }) {
    function handleReadChat() {
        const user = localStorage.getItem('username')
        markThreadAsRead(id, user)
        if (unread) {
            onClick()
        }
    }

    return (
        <Box display="flex" alignItems="center" gap={2} p={1} component={Link} href={`/chat/t/${id}`} sx={{
            borderRadius: 1,
            textDecoration: 'none',
            '&:hover': {
                background: '#eae6f2'
            }
        }} onClick={handleReadChat}>
            <Box sx={{ width: 50, height: 50, background: '#d9d9d9', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
                <PersonIcon sx={{ color: '#6E42CC' }} />
            </Box>
            <Box flex={1} sx={{ overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={unread ? 700 : 400} color={unread ? '#181818' : '#434343'}>
                        @{username}
                    </Typography>
                    <Typography variant="subtitle2" color={unread ? '#181818' : '#9a9a9a'}>
                        {
                            dayjs().diff(timestamp, 'hours') > 23 ? dayjs(timestamp).format('MMM D · h:mm A') : dayjs(timestamp).format('h:mm A')
                        }
                    </Typography>
                </Box>
                <Typography variant="body2" fontWeight={unread ? 700 : 400} color={unread ? '#181818' : '#5a5a5a'} sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}>{message}</Typography>
            </Box>
        </Box>
    )
}

export default function Chat() {
    const [chats, setChats] = useState([])
    const user = localStorage.getItem('username')

    async function updateChats() {
        const chats = await getChats(user)
        setChats(chats)
    }

    function playNewMsgSound() {
        const notifSound = new Audio(newMsgSound)
        notifSound.play()
    }

    useEffect(() => {
        updateChats()
    }, [])

    useEffect(() => {
        socket.on(`new message:${user}`, () => {
            updateChats()
            playNewMsgSound()
        })

        return () => {
            socket.off(`new message:${user}`)
        }
    })

    // For responsive layout
    const { threadId: openThread } = useParams()
    const { pathname } = useLocation()
    const desktopView = useMediaQuery('(min-width: 900px)')
    const hasOpenThread = openThread !== undefined || pathname === '/chat/new'

    return (
        <Box sx={{ display: hasOpenThread && desktopView ? 'flex' : 'block' }}>
            {/* Thread List */}
            <Box sx={{
                px: 4,
                width: '100%',
                maxWidth: hasOpenThread ? '400px' : '100%',
                height: '100vh',
                overflowY: 'scroll',
                display: hasOpenThread ? desktopView ? 'block' : 'none' : 'block'
            }}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        background: '#fff',
                        borderBottom: '1px solid #eee'
                    }}
                >
                    <Typography variant='h3' py={5} textAlign="center" color="#6E42CC" mr='auto'>Chat</Typography>
                    <Tooltip title="New Message">
                        <IconButton aria-label='new message' color="purple" component={Link} href="/chat/new">
                            <CreateIcon />
                        </IconButton>
                    </Tooltip>
                    <AccountMenu user={user} />
                </Box>
                <Box>
                    {chats.length > 0 ?
                        chats.map(
                            ({ _id, recipient, lastMessage, unread }) => (
                                <ChatListItem key={_id} id={_id} username={recipient} message={user === lastMessage.sender ? `You: ${lastMessage.message}` : lastMessage.message} unread={unread} timestamp={lastMessage.updatedAt} onClick={updateChats} />
                            )
                        )
                        :
                        <Typography variant="subtitle2" sx={{
                            color: '#888',
                            textAlign: 'center',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}>Tap the <CreateIcon sx={{ transform: 'translateY(5px)' }} /> icon above to start chatting!</Typography>
                    }
                </Box>
            </Box>

            {/* Right Panel Container (for desktop view) -- will contain thread view */}
            <Box sx={{ flex: 1, position: 'relative', width: '100%', borderLeft: '1px solid #eee' }}>
                <Outlet context={[updateChats]} />
            </Box>
        </Box>
    )
}