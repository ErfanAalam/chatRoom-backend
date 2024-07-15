import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { addUser, removeUser, getUser, getUsersInRoom } from './Users.js'

const app = express()
const port = 5000

app.use(cors({ origin: "*" }))

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("New User Connected");

    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser(
            { id: socket.id, name, room }
        )

        if (error) return callback(error)

        socket.join(user.room)

        socket.emit("message", {
            user: "Admin:Erfan",
            text: `${user.name} Welcome to room ${user.room}`
        })

        socket.broadcast.to(user.room).emit("message", {
            user: 'Admin:Erfan',
            text: `${user.name}, has joined`
        })


        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        console.log(`${user.name} joined room ${user.room}`);

        callback()
    })

    socket.on("sendMessage", (message, callback) => {
        console.log(message);
        const user = getUser(socket.id)
        console.log(user);
        console.log(user.name);
        if (user) {
            io.to(user.room).emit('message', {
                user: user.name,
                text: message
            })

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message',
                {
                    user: 'Admin:Erfan', text:
                        `${user.name} had left`
                });
        }
    })


})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})