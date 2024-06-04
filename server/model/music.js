const { getSongDataUriFromYT } = require('../src/download-song');

const getSong = async (songId) => {
  try {
    const songBuffer  = await getSongDataUriFromYT(songId);
    return songBuffer;

  } catch (error) {
    console.log('model/music/getSong', error);
  }
};



module.exports = {
  getSong,
};