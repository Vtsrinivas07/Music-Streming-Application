import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  
  const audioRef = useRef(null);

  // Update audio element when current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `/uploads/${currentSong.audioFile}`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong, isPlaying]);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update play state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Create audio element and attach event listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set initial volume
    audio.volume = volume;
    
    // Event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      if (queueIndex < queue.length - 1) {
        setQueueIndex(prevIndex => prevIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [queue.length, queueIndex, volume]);

  // Update current song when queue index changes
  useEffect(() => {
    if (queue.length > 0 && queueIndex >= 0 && queueIndex < queue.length) {
      setCurrentSong(queue[queueIndex]);
    }
  }, [queue, queueIndex]);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (user && song._id) {
      axios.put(`/api/songs/${song._id}/play`)
        .catch(err => {
          console.error('Error updating play count:', err);
        });
    }
  }, [user]);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const setVolumeLevel = useCallback((level) => {
    setVolume(level);
  }, []);

  const setProgressLevel = useCallback((level) => {
    setProgress(level);
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  }, []);

  const playList = useCallback((songs, startIndex = 0) => {
    if (songs.length === 0) return;
    setQueue(songs);
    setQueueIndex(startIndex);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      setQueueIndex(prevIndex => prevIndex + 1);
    }
  }, [queue.length, queueIndex]);

  const playPrevious = useCallback(() => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else if (queueIndex > 0) {
      setQueueIndex(prevIndex => prevIndex - 1);
    }
  }, [currentTime, queueIndex]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const toggleLike = useCallback((songId) => {
    if (!user) return;
    axios.put(`/api/songs/${songId}/like`)
      .catch(err => {
        console.error('Error toggling like status:', err);
      });
  }, [user]);

  const value = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    progress,
    queue,
    queueIndex,
    playSong,
    pauseSong,
    togglePlay,
    setVolumeLevel,
    setProgressLevel,
    addToQueue,
    playList,
    toggleLike,
    seekTo,
    playNext,
    playPrevious
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 