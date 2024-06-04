const searchYoutube = require('../src/search-youtube');

module.exports = async (socket, io) => {
  socket.on('search', async ({ query }) => {

    console.log(`user searched with query: ${query}`);
    const searchResults = await searchYoutube(query);
    socket.emit('searchResults', { songs: searchResults });
  });
};
