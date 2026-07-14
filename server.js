const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ==========================================
// 1. STATIC FILES SERVING (Fixes "Cannot GET /")
// ==========================================
// This tells the server to send your HTML, CSS, and JS files to the browser
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// 2. SOCKET.IO (Chat & Live Features)
// ==========================================
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Normal Chat Messages
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    // Developer Powers handling
    socket.on('assign_dev_power', (data) => {
        console.log(`Developer assigned ${data.power} to user: ${data.user}`);
    });

    socket.on('ban_user', (data) => {
        console.log(`User banned: ${data.user}`);
    });

    socket.on('user-reconnected', (userData) => {
        console.log(`User reconnected: ${userData.username}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ==========================================
// 3. SERVER START
// ==========================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});