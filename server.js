const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); 
    });

    socket.on('stop_typing', (data) => {
        socket.broadcast.emit('stop_typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Node Server is running smoothly on port ${PORT}`);
});