module.exports = (socket, io) => {
  socket.on('play-song', (room) => {
    console.log(`play-song emitted to room: ${room}`);
    io.to(room).emit('play-song');
  });
};
