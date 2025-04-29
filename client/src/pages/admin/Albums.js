import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { FaAlbum, FaPlus } from 'react-icons/fa';
import { getAlbums, deleteAlbum, createAlbum, updateAlbum } from '../../services/adminService';
import { getArtists } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import AlbumModal from '../../components/admin/AlbumModal';

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

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumsData, artistsData] = await Promise.all([
          getAlbums(),
          getArtists(),
        ]);
        setAlbums(albumsData);
        setArtists(artistsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (album) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await deleteAlbum(album._id);
        setAlbums(albums.filter(a => a._id !== album._id));
      } catch (error) {
        console.error('Error deleting album:', error);
        setError('Failed to delete album. Please try again.');
      }
    }
  };

  const handleEdit = (album) => {
    setSelectedAlbum(album);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAlbum(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedAlbum) {
        const updatedAlbum = await updateAlbum(selectedAlbum._id, formData);
        setAlbums(albums.map(a => 
          a._id === selectedAlbum._id ? updatedAlbum : a
        ));
      } else {
        const newAlbum = await createAlbum(formData);
        setAlbums([...albums, newAlbum]);
      }
      setModalOpen(false);
      setSelectedAlbum(null);
    } catch (error) {
      throw new Error('Failed to save album. Please try again.');
    }
  };

  const columns = [
    { header: 'Title', key: 'title' },
    { header: 'Artist', key: 'artist.name' },
    { header: 'Release Date', key: 'releaseDate' },
    { header: 'Songs', key: 'songs.length' },
  ];

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Albums</Title>
        <Button variant="primary" onClick={handleCreate}>
          <FaPlus /> Add Album
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={albums}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <AlbumModal
          album={selectedAlbum}
          artists={artists}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedAlbum(null);
          }}
        />
      )}
    </Container>
  );
};

export default Albums; 