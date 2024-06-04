const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

require('dotenv').config({
  path: '.env'
})

const app = express();
const server = http.createServer(app);
const cors = require('cors');


// const io = socketIo(server);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your laptop's local IP and port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));


// all events 
const allEvents = require('./server/events');

const PORT = process.env.PORT || 8080;
console.log(PORT);

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


