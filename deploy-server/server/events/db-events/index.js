const dbGetSong = require('./db-get-song');

module.exports = (socket, io) => {
  dbGetSong(socket, io)
};