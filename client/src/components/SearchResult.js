// import React from 'react';
// import '../styles/SearchResult.css'; // Import the CSS file for styling
// import downloadIcon from '../icons/download.png'; // Adjust the path as needed

// const SearchResult = ({ key, videoId, title, channelTitle, duration, thumbnail, onPlay, onDownload }) => {
//   return (
//     <div className="search-result">
//       <div className="info" onClick={() => onPlay(videoId)}>
//         <img src={thumbnail} alt={title} className="thumbnail-img" />  
//         <div className="title-channel">
//           <span className="title">{title}</span>
//           <span className="channel">{channelTitle}</span>
//         </div>
//         <div className="duration-buttons">
//           <span className="duration">{duration}</span>
//           <button 
//             className="btn download" onClick={(e) => { e.stopPropagation(); onDownload(videoId); }}>
//             <img src={downloadIcon} alt="Download" className="icon" />
//           </button>
          
//           <button className="btn play" onClick={(e) => { e.stopPropagation(); onPlay(videoId); }} >
//             Play
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchResult;


                
import React from 'react';
import '../styles/SearchResult.css'; // Import the CSS file for styling
import downloadIcon from '../icons/download.png'; // Adjust the path as needed
import addToQueueIcon from '../icons/addToQueue.png';

const SearchResult = ({ videoId, title, channelTitle, duration, thumbnail, onPlay, onDownload, onAddToQueue }) => {
  return (
    <div className="search-result">
      <div className="info" onClick={() => onPlay(videoId)}>
        <img src={thumbnail} alt={title} className="thumbnail-img" />  
        <div className="title-channel">
          <span className="title">{title}</span>
          <span className="channel">{channelTitle}</span>
        </div>
        <div className="duration-buttons">
          <span className="duration">{duration}</span>
          <button 
            className="btn download" onClick={(e) => { e.stopPropagation(); onDownload(videoId); }}>
            <img src={downloadIcon} alt="Download" className="icon" />
          </button>
          <button 
            className="btn queue" onClick={(e) => { e.stopPropagation(); onAddToQueue(videoId); }} >
            <img src={addToQueueIcon} alt="addToQueue" className="icon" />
          </button>
          <button className="btn play" onClick={(e) => { e.stopPropagation(); onPlay(videoId); }} >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

