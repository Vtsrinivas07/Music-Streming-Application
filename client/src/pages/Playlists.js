import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PlaylistGrid from '../components/playlists/PlaylistGrid';
import EditPlaylistModal from '../components/playlists/EditPlaylistModal';
import PageHeader from '../components/layout/PageHeader';

const Container = styled.div`
  padding: 20px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const Playlists = () => {
  const navigate = useNavigate();
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      // Get user's playlists
      const myPlaylistsResponse = await axios.get('/api/playlists/my-playlists');
      setMyPlaylists(myPlaylistsResponse.data);

      // Get featured playlists
      const featuredPlaylistsResponse = await axios.get('/api/playlists/featured');
      setFeaturedPlaylists(featuredPlaylistsResponse.data);

      setError(null);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = () => {
    setCurrentPlaylist(null);
    setIsModalOpen(true);
  };

  const handleEditPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setIsModalOpen(true);
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}`);
      // Refresh playlists after deletion
      fetchPlaylists();
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError('Failed to delete playlist. Please try again.');
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist._id}`);
  };

  const handleModalSubmit = async (playlistData) => {
    try {
      if (playlistData.coverImage instanceof File) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', playlistData.coverImage);
        
        // Upload image first
        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update playlist data with image URL
        playlistData.imageUrl = uploadResponse.data.imageUrl;
      }
      
      // Delete the File object as it can't be serialized to JSON
      delete playlistData.coverImage;
      
      if (currentPlaylist) {
        // Update existing playlist
        await axios.put(`/api/playlists/${currentPlaylist._id}`, playlistData);
      } else {
        // Create new playlist
        await axios.post('/api/playlists', playlistData);
      }
      
      // Refresh playlists after creation/update
      fetchPlaylists();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving playlist:', err);
      setError('Failed to save playlist. Please try again.');
    }
  };

  if (isLoading && myPlaylists.length === 0 && featuredPlaylists.length === 0) {
    return (
      <Container>
        <PageHeader title="Playlists" />
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading playlists...</div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader title="Playlists" />
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffcccc', 
          color: '#cc0000', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <PageContent>
        <PlaylistGrid
          title="My Playlists"
          playlists={myPlaylists}
          onPlaylistClick={handlePlaylistClick}
          onCreatePlaylist={handleCreatePlaylist}
          onEditPlaylist={handleEditPlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          showCreateCard={true}
        />
        
        <PlaylistGrid
          title="Featured Playlists"
          playlists={featuredPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />
      </PageContent>
      
      {isModalOpen && (
        <EditPlaylistModal
          playlist={currentPlaylist}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </Container>
  );
};

export default Playlists; 