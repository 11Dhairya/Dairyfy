require('dotenv').config(); 

const moment = require('moment');
const { promisify } = require('util');
const youtube = require('../utils/youtube');

const youtubeSearchList = promisify(youtube.search.list.bind(youtube));
const youtubeVideos = promisify(youtube.videos.list.bind(youtube));

const searchYouTube = async (query) => {
  try {
    let searchResults = [];
    const response = await youtubeSearchList({
      part: 'snippet',
      q: query,
      maxResults: 5,
      type: 'video',
      order: 'relevance'
    });
    // console.log(response.data);
    const audioMetadata = response.data.items; 
    // console.log(audioMetadata);
    for (let item of audioMetadata){
      let audioMetadataItem = {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle
      }
      searchResults.push(audioMetadataItem);
    }

    const allVideoIds = [];
    for (let item of audioMetadata){
      allVideoIds.push(item.id.videoId)
    }

    const durationResponse = await youtubeVideos({
      part: 'contentDetails',
      id: allVideoIds
    });
    // console.log(durationResponse.data);
    const durationMetadata = durationResponse.data.items;
    // console.log(durationMetadata);
    
    for (let i = 0; i < audioMetadata.length; i++){
      searchResults[i].duration = moment.utc(moment.duration(durationMetadata[i].contentDetails.duration).asMilliseconds()).format('HH:mm:ss');;
    }
    return searchResults;

  } catch (error) {
    console.error('An error occurred during YouTube search:', error.message);
    throw error;
  }
}

// test

// async function main() {
//   const searchQuery = 'slipping through my fingers';
//   try {
//     const searchResults = await searchYouTube(searchQuery);
//     console.log('Search Results:', searchResults);
//   } catch (error) {
//     console.error('Failed to fetch search results:', error.message);
//   }
// }

// main();

module.exports = searchYouTube;

