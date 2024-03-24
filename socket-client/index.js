const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
  // socket.emit('play-song');
});

socket.on('data', (data) => {
  console.log('Received data:', data);
  // You can potentially analyze the received data here
});
