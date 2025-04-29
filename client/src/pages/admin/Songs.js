import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { FaMusic, FaPlus } from 'react-icons/fa';
import { getSongs, deleteSong, createSong, updateSong } from '../../services/adminService';
import { getArtists } from '../../services/adminService';
import { getAlbums } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import SongModal from '../../components/admin/SongModal';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: red;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
`;

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, artistsData, albumsData] = await Promise.all([
          getSongs(),
          getArtists(),
          getAlbums(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (song) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteSong(song._id);
        setSongs(songs.filter(s => s._id !== song._id));
      } catch (error) {
        console.error('Error deleting song:', error);
        setError('Failed to delete song. Please try again.');
      }
    }
  };

  const handleEdit = (song) => {
    setSelectedSong(song);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSong(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSong) {
        const updatedSong = await updateSong(selectedSong._id, formData);
        setSongs(songs.map(s => 
          s._id === selectedSong._id ? updatedSong : s
        ));
      } else {
        const newSong = await createSong(formData);
        setSongs([...songs, newSong]);
      }
      setModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      throw new Error('Failed to save song. Please try again.');
    }
  };

  const columns = [
    { header: 'Title', key: 'title' },
    { header: 'Artist', key: 'artist.name' },
    { header: 'Album', key: 'album.title' },
    { header: 'Genre', key: 'genre' },
    { header: 'Duration', key: 'duration' },
  ];

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Songs</Title>
        <Button variant="primary" onClick={handleCreate}>
          <FaPlus /> Add Song
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={songs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <SongModal
          song={selectedSong}
          artists={artists}
          albums={albums}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedSong(null);
          }}
        />
      )}
    </Container>
  );
};

export default Songs; 