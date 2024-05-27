const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// all events 
const allEvents = require('./server/events');

const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/songs', express.static(path.join(__dirname, 'songs')));
app.use(express.static(path.join(__dirname, 'client/public'))); // Serve public files



io.on('connection', (socket) => {
  console.log('A user connected');
  allEvents(socket, io);
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// version: "2"
// authtoken: 2h0uHvmhnjEVjEKHzZ6Ma7ahCl4_7aZNcUh2aRpTVSxwa2EXj
// tunnels:
//   app:
//     addr: 3000
//     proto: http
//     ip_restriction:
//       allow_cidrs:
//         - "103.184.71.128/32"
//         - "122.180.191.90/32"