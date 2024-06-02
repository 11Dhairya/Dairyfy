const pgClient = require('../utils/postgres');
const { getSongDataUriFromYT } = require('../src/download-song');

const getSong = async (songId) => {
  try {
    let songBuffer;
    let songUri;
    const query = 'SELECT * FROM songs WHERE id = $1';
    const values = [songId];

    const result = await pgClient.query(query, values);
    
    if (result && result.rows && result.rows.length > 0) {
      songBuffer = result.rows[0].buffer;
      // songUri = `data:audio/mp3;base64,${songBuffer.toString('base64')}`;
    }
    else{ 
      // const { dataUri: uri, buffer: songBuffer } = await getSongDataUriFromYT(songId);
      songBuffer  = await getSongDataUriFromYT(songId);
      // if (!songBuffer || !uri) throw new Error(`No song with songId = ${songId} in database and YT`);
      // await insertSong(songId, songBuffer);
      insertSong(songId, songBuffer).catch(error => {console.error('Error inserting song:', error);});
      // songUri = uri;
    }
    // return songUri;
    return songBuffer;

  } catch (error) {
    console.log('model/music/getSong', error);
  }
};


const insertSong = async (songId, buffer) => {
  try {
    const query = 'INSERT INTO songs (id, buffer) VALUES ($1, $2)';
    const values = [songId, buffer];
    await pgClient.query(query, values);

  } catch (error) {
    console.log('model/music/insertSong', error);
  }
};


module.exports = {
  getSong,
  insertSong,
};