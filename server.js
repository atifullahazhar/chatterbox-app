const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Required for Socket.io

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows your frontend to connect
        methods: ["GET", "POST"]
    }
});

// Database Connection
require('dotenv').config();
const dbURI = `mongodb+srv://atifullah:${process.env.DB_PASSWORD}@cluster0.i5iserf.mongodb.net/?appName=Cluster0`;

mongoose.connect(dbURI)
    .then(() => console.log('Chatterbox Backend Connected to MongoDB! 🚀'))
    .catch((err) => console.error('Database connection error:', err));

// 2. Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        // Broadcast the message to everyone connected
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});