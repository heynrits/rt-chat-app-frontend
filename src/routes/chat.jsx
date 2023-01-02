import { Fab, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

function ChatListItem({ username, message, unread }) {
    return (
        <Box display="flex" alignItems="center" gap={2} p={1} component={Link} href={`/chat/${username}`} sx={{
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
    const chats = [
        {
            username: 'anotheruser',
            message: 'Hello, welcome to Chat!',
            unread: true
        },
        {
            username: 'notyourfriend',
            message: 'Huh?'
        },
        {
            username: 'lorem_ipsum',
            message: 'The quick brown fox jumps over the lazy dog.'
        },
    ]

    return (
        <Box sx={{ px: 4 }}>
            <Typography variant='h3' py={5} textAlign="center" color="#6E42CC">Chat</Typography>

            <Box>
                { chats.length > 0 ?
                    chats.map(
                        ({ username, message, unread }) => (
                            <ChatListItem key={username} username={username} message={message} unread={unread} />
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

            <Fab color="purple" sx={{ position: "absolute", right: 32, bottom: 32 }}>
                <AddIcon sx={{ color: "#fff" }} />
            </Fab>
        </Box>
    )
}