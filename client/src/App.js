// import React, { useEffect, useState, useRef } from 'react';
// import io from 'socket.io-client';
// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
// import './App.css';
// import SearchBar from './components/SearchBar';
// import SearchResult from './components/SearchResult';

// const socket = io('http://103.82.125.67:8080');

// function App() {
//   const [room, setRoom] = useState('');
//   const player = useRef();
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isSeeking, setIsSeeking] = useState(false);
//   const [isSyncing, setIsSyncing] = useState(false); 
//   const [searchResults, setSearchResults] = useState([]); 
//   const [currentSongPath, setCurrentSongPath] = useState("");
//   const [queue, setQueue] = useState([]); // Queue to hold songs
    
//   useEffect(() => {
//     socket.on('play-song', () => {
//       if (!isSeeking) {
//         player.current.audio.current.play();
//         setIsPlaying(true);
//       }
//     });

//     socket.on('pause-song', () => {
//       if (!isSeeking) {
//         player.current.audio.current.pause();
//         setIsPlaying(false);
//       }
//     });

//     socket.on('seek-song', (seekTime) => {
//       setIsSeeking(true);
//       setIsSyncing(true); 
//       player.current.audio.current.currentTime = seekTime;
//       player.current.audio.current.onseeked = () => {
//         player.current.audio.current.play()
//         .catch(error => { console.log('Error in playing after seek:', error); });
//       };
//       setTimeout(() => {
//         setIsSeeking(false);
//         setIsSyncing(false); 
//       }, 1000); 
//     });
  
//     socket.on('db-get-song-result', (buffer) => {
//       console.log(buffer, Date.now());
//       const songUri = bufferToDataUri(buffer);
//       console.log("db-get-song-result URI received: ", Date.now(), songUri);
//       setCurrentSongPath(songUri);
//       setTimeout(() => {player.current.audio.current.play();}, 500);
//     });
    
//     return () => {
//       socket.off('play-song');
//       socket.off('pause-song');
//       socket.off('seek-song');
//       socket.off('db-get-song-result');
//     };
//   }, [isPlaying, isSeeking]);
  
//   const bufferToDataUri = (buffer) => {
//     const bytes = new Uint8Array(buffer);
//     let binary = '';
//     bytes.forEach(byte => {
//         binary += String.fromCharCode(byte);
//     });
//     return `data:audio/mp3;base64,${btoa(binary)}`;
// };

//   const joinRoom = () => {
//     if (room) {
//       socket.emit('join-room', room);
//     }
//   };

//   const handlePlay = () => {
//     if (!isSeeking) {
//       socket.emit('play-song', { room });
//     }
//   };

//   const handlePause = () => {
//     if (!isSeeking) {
//       socket.emit('pause-song', { room });
//     }
//   };

//   const handleSeeked = async () => {
//     if (!isSyncing) {
//       const seekTime = player.current.audio.current.currentTime;
//       console.log(`Seeked to: ${seekTime}`);
//       socket.emit('seek-song', { room, seekTime });
//     }
//   };

//   const handlePlaySong = (videoId) => {
//     console.log('Song requested: ', Date.now());
//     if (!isSeeking) {
//       if (!room){
//         console.log(`Play song with videoId: ${videoId}`);
//         socket.emit('db-get-song', { songId: videoId });
//       } else {
//         console.log(`Play song in Room: ${room} with videoId: ${videoId}`);
//         socket.emit('db-get-song', { room, songId: videoId });
//       }
//     }
//   };

//   const handleDownloadSong = (videoId) => {
//     console.log(`Download song with videoId: ${videoId}`);
//   };

//   const handleAddToQueue = (videoId) => {
//     console.log(`Song with ${videoId} added to Queue`);
//     setQueue(prevQueue => [...prevQueue, videoId]);
//   };

//   const handleSongEnded = () => {
//     if (queue.length > 0) {
//       const nextSongId = queue[0];
//       setQueue(prevQueue => prevQueue.slice(1));
//       handlePlaySong(nextSongId);
//     } else {
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Dairyfy</h1>
//       <input 
//         type="text" 
//         value={room} 
//         onChange={(e) => setRoom(e.target.value)} 
//         placeholder="Enter room name"
//       />
//       <button onClick={joinRoom}>Join Room</button>
//       <div className="audio-player-container"> {/* Add this container */}
//         <AudioPlayer
//           key={currentSongPath} 
//           ref={player}
//           src={currentSongPath}
//           autoPlayAfterSrcChange={true}
//           onPlay={handlePlay}
//           onPause={handlePause}
//           onSeeked={handleSeeked}
//           onEnded={handleSongEnded} // Handle song ended
//         />
//       </div>
//       <SearchBar socket={socket} setSearchResults={setSearchResults}/>
//       {searchResults.length > 0 && (
//         <div>  
//           <h3>Search Results:</h3>
//           {searchResults.map((song) => {
//             return <div key={song.videoId}> {/* Add key here */}
//               <SearchResult
//                 videoId={song.videoId}
//                 title={song.title}
//                 channelTitle={song.channelTitle}
//                 duration={song.duration}
//                 thumbnail={song.thumbnail}
//                 onPlay={handlePlaySong}
//                 onDownload={handleDownloadSong}
//                 onAddToQueue={handleAddToQueue} // Add to queue
//               />
//             </div>
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// App.js
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';
import LandingPage from './components/LandingPage';

// const socket = io('http://192.168.1.3:8080');
const socket = io(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}${process.env.PORT}`);
console.log(process.env.REACT_APP_WEBSOCKET_SERVER_URL);


function MainPage({ isAuthenticated }) {
  const [room, setRoom] = useState('');
  const player = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [searchResults, setSearchResults] = useState([]); 
  const [currentSongPath, setCurrentSongPath] = useState("");
  const [queue, setQueue] = useState([]); // Queue to hold songs
     
  useEffect(() => {
    socket.on('play-song', () => {
      if (!isSeeking) {
        player.current.audio.current.play();
        setIsPlaying(true);
      }
    });

    socket.on('pause-song', () => {
      if (!isSeeking) {
        player.current.audio.current.pause();
        setIsPlaying(false);
      }
    });

    socket.on('seek-song', (seekTime) => {
      setIsSeeking(true);
      setIsSyncing(true); 
      player.current.audio.current.currentTime = seekTime;
      player.current.audio.current.onseeked = () => {
        player.current.audio.current.play()
        .catch(error => { console.log('Error in playing after seek:', error); });
      };
      setTimeout(() => {
        setIsSeeking(false);
        setIsSyncing(false); 
      }, 1000); 
    });
   
    socket.on('db-get-song-result', (buffer) => {
      const songUri = bufferToDataUri(buffer);
      console.log("db-get-song-result URI received: ");
      setCurrentSongPath(songUri);
      setTimeout(() => {player.current.audio.current.play();}, 500);
    });
     
    return () => {
      socket.off('play-song');
      socket.off('pause-song');
      socket.off('seek-song');
      socket.off('db-get-song-result');
    };
  }, [isPlaying, isSeeking]);
 
  const bufferToDataUri = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return `data:audio/mp3;base64,${btoa(binary)}`;
  };

  const joinRoom = () => {
    if (room) {
      socket.emit('join-room', room);
    }
  };

  const handlePlay = () => {
    if (!isSeeking) {
      socket.emit('play-song', { room });
    }
  };

  const handlePause = () => {
    if (!isSeeking) {
      socket.emit('pause-song', { room });
    }
  };

  const handleSeeked = async () => {
    if (!isSyncing) {
      const seekTime = player.current.audio.current.currentTime;
      console.log(`Seeked to: ${seekTime}`);
      socket.emit('seek-song', { room, seekTime });
    }
  };

  const handlePlaySong = (videoId) => {
    console.log('Song requested: ', Date.now());
    if (!isSeeking) {
      if (!room){
        console.log(`Play song with videoId: ${videoId}`);
        socket.emit('db-get-song', { songId: videoId });
      } else {
        console.log(`Play song in Room: ${room} with videoId: ${videoId}`);
        socket.emit('db-get-song', { room, songId: videoId });
      }
    }
  };

  const handleDownloadSong = (videoId) => {
    console.log(`Download song with videoId: ${videoId}`);
  };

  const handleAddToQueue = (videoId) => {
    console.log(`Song with ${videoId} added to Queue`);
    setQueue(prevQueue => [...prevQueue, videoId]);
  };

  const handleSongEnded = () => {
    if (queue.length > 0) {
      const nextSongId = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      handlePlaySong(nextSongId);
    } else {
      setIsPlaying(false);
    }
  };

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="App">
      <h1>Dairyfy</h1>
      <input 
        type="text" 
        value={room} 
        onChange={(e) => setRoom(e.target.value)} 
        placeholder="Enter room name"
      />
      <button onClick={joinRoom}>Join Room</button>
      <div className="audio-player-container"> {/* Add this container */}
        <AudioPlayer
          key={currentSongPath} 
          ref={player}
          src={currentSongPath}
          autoPlayAfterSrcChange={true}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeeked}
          onEnded={handleSongEnded} // Handle song ended
        />
      </div>
      <SearchBar socket={socket} setSearchResults={setSearchResults}/>
      {searchResults.length > 0 && (
        <div>  
          <h3>Search Results:</h3>
          {searchResults.map((song) => {
            return <div key={song.videoId}> {/* Add key here */}
              <SearchResult
                videoId={song.videoId}
                title={song.title}
                channelTitle={song.channelTitle}
                duration={song.duration}
                thumbnail={song.thumbnail}
                onPlay={handlePlaySong}
                onDownload={handleDownloadSong}
                onAddToQueue={handleAddToQueue} // Add to queue
              />
            </div>
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LandingPage setAuthenticated={setAuthenticated} />
        </Route>
        <Route path="/main">
          <MainPage isAuthenticated={isAuthenticated} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
