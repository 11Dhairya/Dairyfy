import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css'; // Import the CSS file for styling
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';


const socket = io();

function App() {
  const [room, setRoom] = useState('');
  const player = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [searchResults, setSearchResults] = useState([]); 
  const [currentSongPath, setCurrentSongPath] = useState("");
    
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

    socket.on('seek-song', (currentTime) => {
      setIsSeeking(true);
      setIsSyncing(true); // Set syncing to true to prevent loop
      player.current.audio.current.currentTime = currentTime;
      setIsSeeking(false);
      setTimeout(() => setIsSyncing(false), 1000); // Reset syncing after 1 second
    });    

    socket.on('db-get-song-result', (songBuffer) => {
      if (!isSeeking){
        setIsSyncing(true);
        console.log("song buffer recvd: ", songBuffer);
        const blob = new Blob([songBuffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        setTimeout(() => {
          setIsSyncing(false); 
          setCurrentSongPath(url);
        }
        , 1000); // Reset syncing after 1 second
      }
    });
    

    return () => {
      socket.off('play-song');
      socket.off('pause-song');
      socket.off('seek-song');
      socket.off('db-get-song-result');
    };
  }, [ isPlaying, isSeeking ]);

  const joinRoom = () => {
    if (room) {
      socket.emit('join-room', room);
    }
  };

  const handlePlay = () => {
    if (!isSeeking) {
      socket.emit('play-song', room);
    }
  };

  const handlePause = () => {
    if (!isSeeking) {
      socket.emit('pause-song', room);
    }
  };

  const handleSeeked = async () => {
    if (!isSyncing) { // Only emit if not syncing
      const currentTime = player.current.audio.current.currentTime;
      console.log(`Seeked to: ${currentTime}`);
      socket.emit('pause-song', room);
      socket.emit('seek-song', { room, currentTime });
      socket.emit('play-song', room);
    }
  };

  const handlePlaySong = (videoId) => {
    if (!isSeeking && !isSyncing){
      if (!room){
        console.log(`Play song with videoId: ${videoId}`);
        socket.emit('db-get-song', {songId: videoId});
      }
      else{
        console.log(`Play song in Room: ${room} with videoId: ${videoId}`);
        socket.emit('db-get-song', {room, songId: videoId});
      }
    }
  };

  const handleDownloadSong = (videoId) => {
    console.log(`Download song with videoId: ${videoId}`);
    // Implement download functionality
  };

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
          src={currentSongPath} // Correct path to the song in the public directory
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeeked}
        />
      </div>
      <SearchBar socket={socket} setSearchResults={setSearchResults}/>
      {searchResults.length > 0 && (
        <div>  
          <h3>Search Results:</h3>
          {searchResults.map((song) => {
            // const onPlayHandler = room ? handlePlay : handlePlaySong;
            return <div>
              <SearchResult
                key={song.videoId} // Use videoId as key
                videoId={song.videoId}
                title={song.title}
                channelTitle={song.channelTitle}
                duration={song.duration}
                thumbnail={song.thumbnail}
                onPlay={handlePlaySong}
                onDownload={handleDownloadSong}
              />
            </div>
          })}
        </div>
      )}
    </div>
  );
}

export default App;
