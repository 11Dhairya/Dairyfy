const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const downloadSong = async (videoId, songBuffer) => {
   try {
        if (!videoId || !songBuffer) throw new Error(`Empty songId: ${videoId} or empty songBuffer: ${songBuffer}`);
        const filepath = `../../songs/song.mp3`;
        const result = await fs.promises.writeFile(filepath, songBuffer, 'binary');
        console.log(result);

    } catch (error) {
        console.log('downloadSong -> ', error);
    }
};

// const getSongFromYT = async (videoId) => {
//     return new Promise((resolve, reject) => {
//         const mp3Buffer = [];

//         const audioStream = ytdl(videoId, { filter: 'audioonly', quality: 'highestaudio' });
        
//         audioStream.on('data', chunk => {
//             mp3Buffer.push(chunk);
//         });

//         audioStream.on('end', () => {
//             const buffer = Buffer.concat(mp3Buffer);
//             resolve(buffer);
//         });

//         audioStream.on('error', reject);

//         ffmpeg(audioStream)
//             .format('mp3')
//             .on('error', reject)
//             .output('pipe:1')
//             .run();
//     });
    
// }

// best one
// const getSongFromYT = async (videoId) => {
//     const filePath = `songs/${videoId}.mp3`;
//     const stream = ytdl(videoId, { filter: 'audioonly' });

//     const convertToMP3 = () => {
//         return new Promise((resolve, reject) => {
//             ffmpeg(stream)
//                 .toFormat('mp3')
//                 .on('error', (err) => {
//                     reject(new Error(`An error occurred: ${err.message}`));
//                 })
//                 .on('end', () => {
//                     resolve();
//                 })
//                 .pipe(fs.createWriteStream(filePath))
//                 .on('error', (err) => {
//                     reject(new Error(`An error occurred while saving the file: ${err.message}`));
//                 })
//                 .on('finish', () => {
//                     resolve();
//                 });
//         });
//     };
//     try {
//         await convertToMP3();
//         console.log('File saved successfully.');
//     } catch (error) {
//         console.error(error.message);
//     }
// };

const getSongDataUriFromYT = async (videoId) => {
    const stream = ytdl(videoId, { filter: 'audioonly' });

    return new Promise((resolve, reject) => {
        let mp3Buffer = Buffer.from([]);

        ffmpeg(stream)
            .toFormat('mp3')
            .on('error', (err) => {
                reject(new Error(`An error occurred: ${err.message}`));
            })
            .on('data', (chunk) => {
                mp3Buffer = Buffer.concat([mp3Buffer, chunk]);
            })
            .on('end', () => {
                const dataUri = `data:audio/mp3;base64,${mp3Buffer.toString('base64')}`;
                resolve({ dataUri, buffer: mp3Buffer });
            })
            .pipe()
            .on('data', (chunk) => {
                mp3Buffer = Buffer.concat([mp3Buffer, chunk]);
            });
    });
};

const createDataUri = async (videoId) => { 
    const filePath = `../../songs/${videoId}.mp3`;
    try {
        const fileData = await readFileAsync(filePath);
        console.log(fileData, typeof fileData);

        const tryBuff = await getSongFromYT(videoId);
        await fs.promises.writeFile('song.mp3', tryBuff);
        console.log(tryBuff, typeof tryBuff);

        const dataUri = `data:audio/mp3;base64,${fileData.toString('base64')}`;
        return dataUri;
    } catch (error) {
        console.error('Error reading file:', error.message);
        return null;
    }
};


const saveToFile = async (buffer, filePath) => {
    try {
        await fs.promises.writeFile(filePath, buffer);
        console.log('File saved successfully.');
    } catch (error) {
        console.error('Error saving file:', error.message);
    }
};

async function main() {
    try {
        const videoId = 'WgTMeICssXY';
        const {dataUri, buffer} = await getSongDataUriFromYT(videoId);
        console.log('Data URI:', dataUri);
        await saveToFile(buffer, 'song.mp3');
        // console.log(uri);
        // await getSongFromYT(videoId);

    } catch (err) {
        console.error('An error occurred:', err.message);
    }
}


// main();

module.exports = {
    // downloadSong,
    // getSongFromYT,
    // createDataUri,
    getSongDataUriFromYT
};

