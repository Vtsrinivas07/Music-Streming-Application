import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SongList from '../components/songs/SongList';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/songs/favorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load favorites');
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  if (!user) {
    return (
      <Container>
        <Header>
          <Title>Favorites</Title>
          <Description>Please log in to view your favorite songs.</Description>
        </Header>
      </Container>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Header>
        <Title>Favorites</Title>
        <Description>Your favorite songs</Description>
      </Header>

      {favorites.length > 0 ? (
        <SongList songs={favorites} />
      ) : (
        <Description>You haven't liked any songs yet.</Description>
      )}
    </Container>
  );
};

export default Favorites; 