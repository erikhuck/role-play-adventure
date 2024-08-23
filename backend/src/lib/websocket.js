import {Server} from 'socket.io';

const io = new Server({
    path: '/api/websocket',
    cors: {
        origin: '*',
    }
})

io.on('connection', (socket) => {
    console.log('Client connected')
    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

export default io
