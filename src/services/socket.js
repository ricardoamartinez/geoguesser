import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export const createGame = (hostData) => {
  return new Promise((resolve, reject) => {
    console.log('Emitting createGame event with data:', hostData);
    socket.emit('createGame', hostData);
    socket.once('gameCreated', (data) => {
      console.log('Received gameCreated event with data:', data);
      resolve(data);
    });
    socket.once('error', (error) => {
      console.error('Error creating game:', error);
      reject(error);
    });
  });
};

export const joinGame = (gameId, playerData) => {
  return new Promise((resolve, reject) => {
    socket.emit('joinGame', { gameId, playerData });
    socket.once('playerJoined', resolve);
    socket.once('joinError', reject);
  });
};

export const startGame = (gameId, gameOptions) => {
  socket.emit('startGame', { gameId, gameOptions });
};

export const sendMessage = (gameId, message) => {
  socket.emit('sendMessage', { gameId, message });
};

export const onPlayerJoined = (callback) => {
  socket.on('playerJoined', callback);
};

export const onGameStarted = (callback) => {
  socket.on('gameStarted', callback);
};

export const onNewMessage = (callback) => {
  socket.on('newMessage', callback);
};

export default socket;