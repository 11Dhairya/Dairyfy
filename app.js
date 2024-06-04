const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const cors = require('cors');
// const io = socketIo(server);
const io = socketIo(server, {
  cors: {
    origin: 'http://192.168.1.3:8080',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(cors({
  origin: 'http://192.168.1.3:8080', // Replace with your laptop's local IP and port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));


/////
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://103.82.125.67:8080', // Your friend's public IP address
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true
//   }
// });

// const allowOnlyFriendIP = (req, res, next) => {
//   const friendIPAddress = '103.82.125.67'; // Your friend's public IP address
//   const clientIPAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   if (clientIPAddress === friendIPAddress) {
//     next(); 
//   } else {
//     res.status(403).send('Forbidden'); // Send a forbidden response
//   }
// };

// // Use the IP address check middleware before other routes
// app.use(allowOnlyFriendIP);

// // Use CORS with the same origin as in the socket.io configuration
// app.use(cors({
//   origin: 'http://103.82.125.67:8080', // Your friend's public IP address
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }));
// /////


// all events 
const allEvents = require('./server/events');

const PORT = process.env.PORT || 8080;

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