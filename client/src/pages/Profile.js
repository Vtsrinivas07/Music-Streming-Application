import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PlaylistGrid from '../components/playlists/PlaylistGrid';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  background: ${props => props.theme.colors.background};
  border-radius: 50%;
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

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <Container>
      <Header>
        <Avatar>
          <img src={profile.avatar || '/default-avatar.jpg'} alt={profile.username} />
        </Avatar>
        <Info>
          <Title>{profile.username}</Title>
          <Description>{profile.bio || 'No bio yet'}</Description>
          <MetaInfo>
            <span>{profile.playlists?.length || 0} playlists</span>
            <span>•</span>
            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
          </MetaInfo>
        </Info>
      </Header>

      {profile.playlists && profile.playlists.length > 0 && (
        <Section>
          <SectionTitle>{isOwnProfile ? 'Your Playlists' : 'Playlists'}</SectionTitle>
          <PlaylistGrid playlists={profile.playlists} />
        </Section>
      )}
    </Container>
  );
};

export default Profile; 