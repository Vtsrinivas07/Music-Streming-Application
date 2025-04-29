import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { FaUser, FaPlus } from 'react-icons/fa';
import { getArtists, deleteArtist, createArtist, updateArtist } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ArtistModal from '../../components/admin/ArtistModal';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchArtists = async () => {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [user, navigate]);

  const handleDelete = async (artist) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        await deleteArtist(artist._id);
        setArtists(artists.filter(a => a._id !== artist._id));
      } catch (error) {
        console.error('Error deleting artist:', error);
        setError('Failed to delete artist. Please try again.');
      }
    }
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedArtist(null);
    setModalOpen(true);
  };

  const handleSave = async (artistData) => {
    try {
      if (!user || !user._id) {
        setError('You must be logged in to perform this action.');
        navigate('/login');
        return;
      }

      const data = {
        ...artistData,
        addedBy: user._id,
        genres: []
      };
      
      if (selectedArtist) {
        const updatedArtist = await updateArtist(selectedArtist._id, data);
        setArtists(artists.map(a => a._id === selectedArtist._id ? updatedArtist : a));
      } else {
        const newArtist = await createArtist(data);
        setArtists([...artists, newArtist]);
      }
      setModalOpen(false);
      setSelectedArtist(null);
      setError(null);
    } catch (error) {
      console.error('Error saving artist:', error);
      setError(error.message || 'Failed to save artist. Please try again.');
    }
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Bio', key: 'bio' },
    { header: 'Songs', key: 'songs.length' },
    { header: 'Albums', key: 'albums.length' },
  ];

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }

  if (!user) {
    return <Container><div>Please log in to access this page.</div></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Artists</Title>
        <Button variant="primary" onClick={handleCreate}>
          <FaPlus /> Add Artist
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={artists}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <ArtistModal
          artist={selectedArtist}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedArtist(null);
          }}
        />
      )}
    </Container>
  );
};

export default Artists; 