import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Music, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import './MusicPlayer.css';

const CLIENT_ID = '620ecc38';

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnRightSide, setIsOnRightSide] = useState(false);
  
  const audioRef = useRef(null);

  const handleDragEnd = (event, info) => {
    // Si el widget se suelta en la mitad derecha de la pantalla
    if (info.point.x > window.innerWidth / 2) {
      setIsOnRightSide(true);
    } else {
      setIsOnRightSide(false);
    }
  };

  // Fetch tracks from Jamendo on mount
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=50&tags=electronic,chill&include=musicinfo`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const shuffledTracks = data.results.sort(() => 0.5 - Math.random());
          setTracks(shuffledTracks);
        } else {
          throw new Error("No tracks found");
        }
      } catch (error) {
        console.error("Error fetching Jamendo music:", error);
        // Fallback track si falla la API (ej. AdBlockers)
        setTracks([{
          name: "Cyberpunk City (Fallback)",
          artist_name: "System",
          audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=150"
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const currentTrack = tracks[currentTrackIndex];

  // Handle Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Navegadores modernos pueden bloquear autoplay, capturamos el error
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Next Track
  const nextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    // When changing tracks manually, ensure it plays if it was playing, or even if it was paused to start the new one
    setIsPlaying(true);
  };

  // When track ends, go to next
  const handleEnded = () => {
    nextTrack();
  };

  // Update audio source and play when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Autoplay prevented:", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Handle Mute toggle
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
  };

  // Evitar retornar null, mostramos cargando o el componente con fallback
  if (isLoading && tracks.length === 0) {
    // Retornamos un botón inactivo que luego se llenará
  }

  return (
    <motion.div 
      className={`music-player-container ${isOnRightSide ? 'direction-left' : 'direction-right'}`}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ touchAction: 'none' }}
    >
      <audio 
        ref={audioRef} 
        onEnded={handleEnded} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {!isExpanded && (
          <motion.div 
            className="music-player-collapsed"
            initial={{ x: isOnRightSide ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isOnRightSide ? 100 : -100, opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`disc-icon ${isPlaying ? 'spinning' : ''}`}>
              <Music size={20} />
            </div>
            <div className={`collapsed-indicator ${isOnRightSide ? 'indicator-left' : 'indicator-right'}`}>
              {isOnRightSide ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="music-player-expanded glass-panel"
            initial={{ x: isOnRightSide ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isOnRightSide ? 300 : -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <button className={`collapse-btn ${isOnRightSide ? 'btn-right' : 'btn-left'}`} onClick={() => setIsExpanded(false)} aria-label="Collapse player">
              {isOnRightSide ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <div className="player-content">
              <div className={`album-art-container ${isPlaying ? 'spinning-slow' : ''}`}>
                <img 
                  src={currentTrack?.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=150'} 
                  alt="Album Art" 
                  className="album-art"
                />
                <div className="album-art-center"></div>
              </div>

              <div className="track-info">
                <div className="track-name">{currentTrack?.name || 'Cargando...'}</div>
                <div className="track-artist">{currentTrack?.artist_name || 'Jamendo Music'}</div>
              </div>

              <div className="player-controls">
                <button onClick={toggleMute} className="control-btn secondary-btn" aria-label="Toggle Mute">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                
                <button onClick={togglePlay} className="control-btn main-btn" aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="play-icon-offset" />}
                </button>
                
                <button onClick={nextTrack} className="control-btn secondary-btn" aria-label="Next Track">
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MusicPlayer;
