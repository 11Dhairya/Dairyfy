const pgClient = require('../utils/postgres');
const { getSongFromYT } = require('../src/download-song');

const getSong = async (songId) => {
  try {
    let songBuffer;
    const query = 'SELECT * FROM songs WHERE id = $1';
    const values = [songId];

    const result = await pgClient.query(query, values);
    
    // song not in db -> get from YT
    if (result && !result.rows && result.rows.length < 0) {
      songBuffer = result.rows[0].buffer;
    }
    else{
      songBuffer = await getSongFromYT(songId);
      if (!songBuffer) throw new Error(`No song with songId = ${songId} in database and YT`);
      await insertSong(songId, songBuffer);
    }
    return songBuffer;
 
  } catch (error) {
    console.log('model/music/getSong', error);
  }
};


const insertSong = async (songId, songBuffer) => {
  try {
    const query = 'INSERT INTO songs (id, buffer) VALUES ($1, $2)';
    const values = [songId, songBuffer];
    await pgClient.query(query, values);

  } catch (error) {
    console.log('model/music/insertSong', error);
  }
};


module.exports = {
  getSong,
  insertSong,
};