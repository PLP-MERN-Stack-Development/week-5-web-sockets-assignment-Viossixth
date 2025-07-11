const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {}; // username -> socket.id
let chatHistory = [];

io.on('connection', (socket) => {
  const { username } = socket.handshake.query;
  let currentRoom = null;

  if (!username) {
    socket.disconnect();
    return;
  }

  onlineUsers[username] = socket.id;
  io.emit('onlineUsers', Object.keys(onlineUsers));
  console.log(`User connected: ${username} (socket id: ${socket.id})`);

  chatHistory.forEach((msg) => {
  socket.emit('message', msg);
});


  socket.on('joinRoom', (roomName) => {
    if (currentRoom) socket.leave(currentRoom);
    currentRoom = roomName;
    socket.join(roomName);

    io.to(currentRoom).emit('roomMessage', {
      sender: 'System',
      message: `${username} joined the room.`,
      timestamp: Date.now(),
      room: currentRoom,
      system: true,
      type: 'join',
    });
  });

  socket.on('message', (msg) => {
    chatHistory.push(msg);
    if (chatHistory.length > 100) chatHistory.shift();
    socket.broadcast.emit('message', msg); // Sends to everyone *except* the sender
  });

  socket.on('roomMessage', (msg) => {
    if (!currentRoom) return;
    const fullMsg = {
      sender: username,
      message: msg.message,
      timestamp: Date.now(),
      room: currentRoom,
    };
    io.to(currentRoom).emit('roomMessage', fullMsg);
  });

  socket.on('privateMessage', ({ to, message }) => {
    const targetSocketId = onlineUsers[to];
    if (targetSocketId) {
      const privateMsg = { sender: username, message, timestamp: Date.now(), private: true };
      io.to(targetSocketId).emit('privateMessage', privateMsg);
      socket.emit('privateMessage', privateMsg);
    }
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping', username);
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      io.to(currentRoom).emit('roomMessage', {
        sender: 'System',
        message: `${username} left the room.`,
        timestamp: Date.now(),
        room: currentRoom,
        system: true,
        type: 'leave',
      });
    }
    delete onlineUsers[username];
    io.emit('onlineUsers', Object.keys(onlineUsers));
    console.log(`User disconnected: ${username}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


