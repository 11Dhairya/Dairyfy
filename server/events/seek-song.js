module.exports = (socket, io) => {
  socket.on('seek-song', ({ room, seekTime }) => {
    console.log(`seek-song emitted to room: ${room} with time: ${seekTime}`);
    io.to(room).emit('seek-song', seekTime);
  });
};
