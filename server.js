const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

// Apply CORS middleware to Express
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Game session storage
const gameSessions = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createGame', (hostData) => {
    console.log('Received createGame event with data:', hostData);
    const gameId = uuidv4();
    const gameSession = {
      id: gameId,
      host: socket.id,
      players: [{ id: socket.id, ...hostData }],
      gameOptions: {},
      status: 'waiting'
    };
    gameSessions.set(gameId, gameSession);
    socket.join(gameId);
    console.log('Emitting gameCreated event with data:', { gameId, gameSession });
    socket.emit('gameCreated', { gameId, gameSession });
  });

  socket.on('joinGame', ({ gameId, playerData }) => {
    const gameSession = gameSessions.get(gameId);
    if (gameSession && gameSession.status === 'waiting') {
      gameSession.players.push({ id: socket.id, ...playerData });
      socket.join(gameId);
      io.to(gameId).emit('playerJoined', { gameSession });
    } else {
      socket.emit('joinError', { message: 'Game not found or already started' });
    }
  });

  socket.on('startGame', ({ gameId, gameOptions }) => {
    const gameSession = gameSessions.get(gameId);
    if (gameSession && socket.id === gameSession.host) {
      gameSession.status = 'playing';
      gameSession.gameOptions = gameOptions;
      io.to(gameId).emit('gameStarted', { gameSession });
    }
  });

  socket.on('sendMessage', ({ gameId, message }) => {
    io.to(gameId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Handle player disconnection (remove from game sessions, notify other players, etc.)
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));