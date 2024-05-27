const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

const downloadSong = async (videoId, songBuffer) => {
   try {
        if (!videoId || !songBuffer) throw new Error(`Empty songId: ${videoId} or empty songBuffer: ${songBuffer}`);
        const filepath = `../../songs/${videoId}.mp3`;
        // const result = await fs.promises.(filepath);
        console.log(result);
        // if (result) throw new Error(`Cannot download song with songId: ${videoId}, it already exists`);
        // await fs.promises.writeFile(filepath, songBuffer);
    } catch (error) {
        console.log('downloadSong -> ', error);
    }
};

const getSongFromYT = async (videoId) => {
    return new Promise((resolve, reject) => {
        const mp3Buffer = [];

        const audioStream = ytdl(videoId, { filter: 'audioonly', quality: 'highestaudio' });
        
        audioStream.on('data', chunk => {
            mp3Buffer.push(chunk);
        });

        audioStream.on('end', () => {
            const buffer = Buffer.concat(mp3Buffer);
            resolve(buffer);
        });

        audioStream.on('error', reject);

        ffmpeg()
        .input(audioStream)
        .format('mp3')
        .on('error', reject)
        .outputOptions('-f mp3')
        .output('pipe:1')
        .run();
    });
}

async function main() {
    try {
        const videoId = 'tWkUTPj1BT8';
        const songBuffer = await getSongFromYT(videoId);
        console.log(songBuffer);
        // await downloadSong(videoId, songBuffer);
    } catch (err) {
        console.error('An error occurred:', err.message);
    }
}

// main();

module.exports = {
    // downloadSong,
    getSongFromYT
};

