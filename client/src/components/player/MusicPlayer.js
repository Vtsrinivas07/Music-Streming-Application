import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { PlayerContext } from '../../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: #121212;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 180px;

  @media (max-width: 768px) {
    width: 40%;
  }
`;

const SongImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
  background-color: #282828;
`;

const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SongTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.div`
  font-size: 12px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  margin: 0 15px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    transform: scale(1.1);
  }

  &.play-pause {
    font-size: 32px;
  }

  @media (max-width: 576px) {
    margin: 0 8px;
    &.play-pause {
      font-size: 28px;
    }
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 300px;
  }

  @media (max-width: 576px) {
    max-width: 200px;
  }
`;

const ProgressBar = styled.div`
  height: 5px;
  background-color: #5a5a5a;
  border-radius: 2px;
  flex: 1;
  cursor: pointer;
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
  width: ${props => props.progress}%;
`;

const TimeDisplay = styled.div`
  font-size: 12px;
  color: #aaa;
  min-width: 40px;
  text-align: center;
`;

const Volume = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 120px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 15%;
    min-width: 50px;
  }
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;

  @media (max-width: 576px) {
    margin-right: 0;
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100px;
  height: 5px;
  border-radius: 2px;
  background: #5a5a5a;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: ${props => (props.liked ? 'var(--primary-color)' : 'white')};
  font-size: 16px;
  margin-left: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    margin-left: 15px;
  }
`;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const defaultCoverImage = '/images/default-song.jpg';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleLike,
  } = useContext(PlayerContext);
  
  const { user } = useContext(AuthContext);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isLiked, setIsLiked] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const clickPercentage = clickPosition / progressBarWidth;
    const seekTime = duration * clickPercentage;
    seekTo(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleLikeToggle = () => {
    if (user && currentSong) {
      toggleLike(currentSong._id);
      setIsLiked(!isLiked);
    }
  };

  if (!currentSong) return null;

  return (
    <PlayerContainer>
      <SongInfo>
        <SongImage 
          src={currentSong.coverImage ? `/uploads/${currentSong.coverImage}` : defaultCoverImage} 
          alt={currentSong.title}
          onError={(e) => {
            e.target.src = defaultCoverImage;
          }}
        />
        <SongDetails>
          <SongTitle>{currentSong.title}</SongTitle>
          <SongArtist>{currentSong.artist?.name || 'Unknown Artist'}</SongArtist>
        </SongDetails>
      </SongInfo>

      <Controls>
        <ControlButtons>
          <ControlButton onClick={playPrevious}>
            <FaStepBackward />
          </ControlButton>
          <ControlButton className="play-pause" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </ControlButton>
          <ControlButton onClick={playNext}>
            <FaStepForward />
          </ControlButton>
        </ControlButtons>

        <ProgressContainer>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <ProgressBar onClick={handleProgressClick}>
            <Progress progress={progress} />
          </ProgressBar>
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressContainer>
      </Controls>

      <Volume>
        <VolumeButton onClick={handleVolumeToggle}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </VolumeButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        {user && (
          <LikeButton onClick={handleLikeToggle} liked={isLiked}>
            <FaHeart />
          </LikeButton>
        )}
      </Volume>
    </PlayerContainer>
  );
};

export default MusicPlayer; 