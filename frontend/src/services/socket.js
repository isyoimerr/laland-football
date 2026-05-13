import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
})

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

export const subscribeToMatch = (matchId) => {
  socket.emit('subscribe:match', matchId)
}

export const unsubscribeFromMatch = (matchId) => {
  socket.emit('unsubscribe:match', matchId)
}

export default socket
