const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Static files (HTML, CSS, JS) serve karne ke liye
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ⚡ Socket.io Real-time Logic
io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    // World Chat Message Broadcast
    socket.on('send_message', (data) => {
        // Jisne bheja usko chhod kar sabko message bhej do
        socket.broadcast.emit('receive_message', data);
    });

    // Typing Indicators
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); 
    });

    socket.on('stop_typing', (data) => {
        socket.broadcast.emit('stop_typing', data);
    });

    // User Disconnect
    socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Chatterbox Backend Server is running smoothly on port ${PORT}`);
});