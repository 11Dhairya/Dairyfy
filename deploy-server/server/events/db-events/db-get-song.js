const { getSong } = require('../../model/music');

module.exports = async (socket, io) => {
  socket.on('db-get-song', async ({ room, songId }) => {
    const buffer = await getSong(songId);
    if (!room){
      console.log(`db-get-song with songID: ${songId}`);
      socket.emit('db-get-song-result', buffer);
    } else{
      console.log(`db-get-song room: ${room} with songID: ${songId}`);
      io.to(room).emit('db-get-song-result', buffer);
    }
  });
};

