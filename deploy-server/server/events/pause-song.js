module.exports = (socket, io) => {
  socket.on('pause-song', ({room}) => {
    console.log(`pause-song emitted to room: ${room}`);
    if (room)
      io.to(room).emit('pause-song');
    else
      socket.emit('pause-song');
  });
};
