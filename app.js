const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const router = require('./routes');
const { hostname } = require('os');

const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/api', router);
const server = http.createServer(app);
const io = new socketIo.Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');
  
//   // Handle song play event
//   socket.on('play-song', () => {
//     const filePath = 'path/to/your/song.mp3';
//     const readStream = fs.createReadStream(filePath);
//     readStream.pipe(socket);
//   });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
