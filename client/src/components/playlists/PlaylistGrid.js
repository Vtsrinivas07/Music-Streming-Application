import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay, FaEllipsisH } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const PlaylistCard = styled.div`
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background-color: #282828;
  }
  
  &:hover .play-button {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PlaylistCover = styled.div`
  position: relative;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;
  background-color: #282828;
  
  &:before {
    content: "";
    display: block;
    padding-top: 100%; /* 1:1 Aspect Ratio */
  }
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1DB954;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 2;
  
  &:hover {
    transform: scale(1.05) translateY(0);
    background-color: #1ed760;
  }
`;

const PlaylistTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistInfo = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistOptions = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #b3b3b3;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const NoPlaylistsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: #b3b3b3;
  font-size: 16px;
`;

const EmptyPlaylistCard = styled.div`
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 240px;
  cursor: pointer;
  border: 2px dashed #333;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #282828;
    border-color: #1DB954;
  }
  
  svg {
    font-size: 40px;
    color: #b3b3b3;
    margin-bottom: 16px;
  }
  
  p {
    color: #b3b3b3;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
`;

const defaultCoverImage = '/images/default-playlist.jpg';

const PlaylistGrid = ({ 
  title, 
  playlists = [], 
  onPlaylistClick, 
  onCreatePlaylist, 
  onEditPlaylist, 
  onDeletePlaylist, 
  showCreateCard = false
}) => {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h2>
      <Grid>
        {showCreateCard && (
          <EmptyPlaylistCard onClick={onCreatePlaylist}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="#b3b3b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Create a new playlist</p>
          </EmptyPlaylistCard>
        )}
        
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistCard key={playlist._id}>
              <PlaylistCover onClick={() => onPlaylistClick(playlist)}>
                <img 
                  src={playlist.coverImage ? `/uploads/${playlist.coverImage}` : defaultCoverImage} 
                  alt={playlist.name}
                  onError={(e) => {
                    e.target.src = defaultCoverImage;
                  }}
                />
                <PlayButton className="play-button">
                  <FaPlay />
                </PlayButton>
              </PlaylistCover>
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
              <PlaylistInfo>
                {playlist.description ? (
                  playlist.description.substring(0, 40) + (playlist.description.length > 40 ? '...' : '')
                ) : (
                  `${playlist.songs?.length || 0} songs`
                )}
              </PlaylistInfo>
              
              <PlaylistOptions onClick={(e) => {
                e.stopPropagation();
                // Show a dropdown/popover menu for edit and delete actions
                // For simplicity, we'll just use a dropdown for now
                const action = window.confirm(`Edit or delete "${playlist.name}"?`) ? 
                  (window.confirm('Delete the playlist?') ? 'delete' : 'edit') : null;
                  
                if (action === 'edit') {
                  onEditPlaylist(playlist);
                } else if (action === 'delete') {
                  onDeletePlaylist(playlist._id);
                }
              }}>
                <FaEllipsisH />
              </PlaylistOptions>
            </PlaylistCard>
          ))
        ) : (
          <NoPlaylistsMessage>
            {title === 'My Playlists' ? 'Create your first playlist to get started!' : 'Like playlists to see them here!'}
          </NoPlaylistsMessage>
        )}
      </Grid>
    </div>
  );
};

export default PlaylistGrid; 