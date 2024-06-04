const joinRoom = require('./join-room');
const playSong = require('./play-song');
const pauseSong = require('./pause-song');
const seekSong = require('./seek-song');
const searchSong = require('./search-song');
const disconnect = require('./disconnect');

const dbEvents = require('./db-events');

module.exports = (socket, io) => {
  joinRoom(socket, io);
  playSong(socket, io);
  pauseSong(socket, io);
  seekSong(socket, io);
  searchSong(socket, io);
  disconnect(socket, io);
  dbEvents(socket, io);
};
