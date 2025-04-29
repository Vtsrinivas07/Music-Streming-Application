import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SongList from '../components/songs/SongList';
import EditPlaylistModal from '../components/playlists/EditPlaylistModal';
import { Button } from '../components/common/Button';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CoverImage = styled.div`
  width: 300px;
  height: 300px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`/api/playlists/${id}`);
        setPlaylist(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load playlist');
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await axios.put(`/api/playlists/${id}`, updatedData);
      setPlaylist(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update playlist');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await axios.delete(`/api/playlists/${id}`);
        navigate('/playlists');
      } catch (err) {
        setError('Failed to delete playlist');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!playlist) return <div>Playlist not found</div>;

  const isOwner = user && user._id === playlist.user._id;

  return (
    <Container>
      <Header>
        <CoverImage>
          <img src={playlist.coverImage || '/default-playlist.jpg'} alt={playlist.name} />
        </CoverImage>
        <Info>
          <Title>{playlist.name}</Title>
          <Description>{playlist.description}</Description>
          <MetaInfo>
            <span>{playlist.songs.length} songs</span>
            <span>•</span>
            <span>Created by {playlist.user.username}</span>
          </MetaInfo>
          {isOwner && (
            <Actions>
              <Button onClick={handleEdit}>Edit Playlist</Button>
              <Button variant="danger" onClick={handleDelete}>Delete Playlist</Button>
            </Actions>
          )}
        </Info>
      </Header>

      <SongList songs={playlist.songs} />

      {isEditing && (
        <EditPlaylistModal
          playlist={playlist}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Container>
  );
};

export default PlaylistDetails; 