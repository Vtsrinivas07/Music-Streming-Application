import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaHeart, FaRegHeart } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CoverImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  background-color: #282828;
`;

const SongTitle = styled.div`
  font-weight: 500;
`;

const ArtistName = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0.5rem;
  margin: 0 0.25rem;
  transition: all 0.2s;
  
  &:hover {
    color: #fff;
    transform: scale(1.1);
  }
  
  &.playing {
    color: ${props => props.theme.colors.primary};
  }
`;

const defaultCoverImage = '/images/default-song.jpg';

const SongList = ({ songs }) => {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();
  const { user } = useAuth();

  const handlePlayPause = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const handleLike = async (songId) => {
    try {
      const response = await fetch(`/api/songs/${songId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      // Refresh the songs list or update the UI accordingly
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th>#</Th>
          <Th>Title</Th>
          <Th>Album</Th>
          <Th>Duration</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => (
          <Tr key={song._id}>
            <Td>{index + 1}</Td>
            <Td>
              <SongInfo>
                <CoverImage 
                  src={song.coverImage ? `/uploads/${song.coverImage}` : defaultCoverImage}
                  alt={song.title}
                  onError={(e) => {
                    e.target.src = defaultCoverImage;
                  }}
                />
                <div>
                  <SongTitle>{song.title}</SongTitle>
                  <ArtistName>{song.artist?.name}</ArtistName>
                </div>
              </SongInfo>
            </Td>
            <Td>{song.album?.title}</Td>
            <Td>{song.duration}</Td>
            <Td>
              <ActionButton 
                onClick={() => handlePlayPause(song)}
                className={currentSong?._id === song._id && isPlaying ? 'playing' : ''}
              >
                {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
              </ActionButton>
              {user && (
                <ActionButton 
                  onClick={() => handleLike(song._id)}
                  className={Array.isArray(song.likes) && song.likes.includes(user?._id) ? 'playing' : ''}
                >
                  {Array.isArray(song.likes) && song.likes.includes(user?._id) ? <FaHeart /> : <FaRegHeart />}
                </ActionButton>
              )}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SongList; 