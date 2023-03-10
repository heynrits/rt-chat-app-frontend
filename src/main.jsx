import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Axios from 'axios'

import Root from './routes/root'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './routes/landing'
import Chat from './routes/chat'
import NewChat from './routes/chat/new'
import ChatThread from './routes/chat/thread'
import './index.css'

import chatThreadLoader from './loaders/chatThreadLoader'

Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

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
        children: [
          {
            path: 't/:threadId',
            loader: chatThreadLoader,
            element: (
              <ProtectedRoute>
                <ChatThread />
              </ProtectedRoute>
            )
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <NewChat />
              </ProtectedRoute>
            )
          },
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
