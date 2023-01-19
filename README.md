# Real-Time Chat Web Application (Front-End)

This project is the front-end UI of a simple chat application with real-time features implemented using [Socket.IO](https://socket.io/). My main objective for the entirety of the project was to implement real-time web app features, hence, to focus on my objective, other essential features present in production-ready chat apps such as authentication and encryption were intentionally left out.

## Technologies Used
- [Socket.IO](https://socket.io/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/en/main/start/overview)
- [MUI](https://mui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com/)

## Features
- send and receive text messages
- new message notification
- indicator when the other user in the conversation is typing a message
- responsive layout for mobile and desktop

## Constraints
- user authentication and message encryption are not implemented

## Setting up
### Environment Variables
Rename `.env.sample` to `.env` and fill the variables with the appropriate expected values.

### Installing packages
```
npm i
```
### Running the app locally
```
npm run dev
```
### Building for production
```
npm run build
npm run preview
```
## Demo
You may check out the app by visiting [this link](https://rt-chat-app-frontend.vercel.app/). This is just a demonstration and bugs may appear at any point while using the app, so try it at your own risk.

## Credits
- <a target="_blank" href="https://icons8.com/icon/GT6L6Gn3DzSA/messages">Messages</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
- [WebDevSimplified/React-Infinite-Scrolling](https://github.com/WebDevSimplified/React-Infinite-Scrolling)