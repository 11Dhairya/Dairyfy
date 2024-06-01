import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';
import { BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

const socket = io('http://192.168.1.3:8080');

function App() {
  const [room, setRoom] = useState('');
  const player = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [searchResults, setSearchResults] = useState([]); 
  const [currentSongPath, setCurrentSongPath] = useState("");
  const [authState, setAuthState] = useState({username:"",id:0,status:false});
    
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
      // player.current.audio.current.pause();
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
  
    socket.on('db-get-song-result', (songUri) => {
      console.log("db-get-song-result URI recvd");
      setCurrentSongPath(songUri);
      // setTimeout(() => { player.current.audio.current.play(); }, 500);
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
      socket.emit('play-song', {room});
    }
  };

  const handlePause = () => {
    if (!isSeeking) {
      socket.emit('pause-song', {room});
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
    if (!isSeeking) {
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
  };

  return (
    <div className="App">
       <Router>
          <div className='navbar'>
          <div className='links'>
            {(!authState.status)?(
              <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
              </>
            ):(
              <>
            <Link to="/createpost">Create A Post</Link>
            <Link to="/">Home Page</Link>
              </>
            )}
          </div>
          {/* <div className='loggedInContainer'>
              <h1>{authState.username}</h1>
              {authState.status&& <button onClick={logout}>Logout</button>}
          </div> */}
          </div>
          <Switch>
          {/* <Route exact path="/"><Home/> </Route> */}
          {/* <Route exact path="/createpost"><CreatePost/></Route> */}
          {/* <Route exact path="/post/:id"><Post/></Route> */}
          <Route exact path="/login"><Login/></Route>
          <Route exact path="/register"><Register/></Route>
          {/* <Route exact path="/profile/:id"><Profile/></Route> */}
          {/* <Route exact path="*"><PageNotFound/></Route> */}
          </Switch>
        </Router>
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
        />
      </div>
      <SearchBar socket={socket} setSearchResults={setSearchResults}/>
      {searchResults.length > 0 && (
        <div>  
          <h3>Search Results:</h3>
          {searchResults.map((song) => {
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
