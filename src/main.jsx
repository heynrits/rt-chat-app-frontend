import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Root from './routes/root'
import './index.css'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './routes/landing'
import Chat from './routes/chat'
import NewChat from './routes/chat/new'
import ChatThread from './routes/chat/thread'
import Axios from 'axios'
import { getThread } from './api/chat'

Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const user = localStorage.getItem('username')

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'welcome',
        element: (
          <ProtectedRoute unauthenticatedOnly>
            <Landing />
          </ProtectedRoute>
        )
      },
      {
        path: 'chat',
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat/new',
        element: (
          <ProtectedRoute>
            <NewChat />
          </ProtectedRoute>
        )
      },
      {
        path: 'chat/t/:threadId',
        loader: async ({params}) => getThread(user, params.threadId, { page: 1 }),
        element: (
          <ProtectedRoute>
            <ChatThread />
          </ProtectedRoute>
        )
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
