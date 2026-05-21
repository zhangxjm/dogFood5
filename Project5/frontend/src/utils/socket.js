import { io } from 'socket.io-client'

let socket = null

export function initSocket(userId) {
  if (!userId) {
    console.warn('Cannot init socket: userId is required')
    return null
  }
  
  if (socket) {
    socket.close()
  }
  
  socket = io('http://localhost:3000', {
    query: { userId }
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function closeSocket() {
  if (socket) {
    socket.close()
    socket = null
  }
}
