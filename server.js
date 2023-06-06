const mongoose = require('mongoose');
const cors = require('cors')

const express = require('express');
const socketIO = require('socket.io');

const app = express();

require('dotenv').config()

const notFoundMiddleware = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandler')


const PORT = process.env.PORT || 5000
const server = app.listen(PORT);
const io = socketIO(server,{
    cors:process.env.CLIENT_URL
});

const authRouter = require('./routes/auth')
const conversationRouter = require('./routes/conversation')
const messageRouter = require('./routes/message')

app.use(express.json())
app.use(cors())
// Routes
app.get('/', (req, res) => {
    res.send('Hello from Server')
})

app.use('/api/auth', authRouter)
app.use('/api/conversation',conversationRouter)
app.use('/api/message',messageRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)




io.on('connection', (socket) => {
    console.log('A user connected', socket.id)

    socket.on('joinRoom', (room) => {
        console.log('Room Joined',room)
        socket.join(room);
    })

    socket.on('leaveRoom', room => {
        console.log('Room leaved',room)
        socket.leave(room);
    })

    socket.on('message', (data) => {
        console.log('Message send server ', data)
        console.log(typeof (data.conversationId))

        io.to(data.conversationId).emit('message', data);
    })
    socket.on('disconnect', () => {
        console.log('Disconnected....', socket.id)
    })
})


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB')
        // server.listen(PORT, () => {
        //     console.log(`App is listening on port ${PORT}`)
        // })
    } catch (error) {
        console.log(error)
    }
}

start()
