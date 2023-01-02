import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Root from './routes/root'
import './index.css'
import Landing from './routes/landing'
import Chat from './routes/chat'
import NewChat from './routes/chat/new'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'welcome',
        element: <Landing />
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'chat/new',
        element: <NewChat />
      }      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
