import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const StatValue = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
  margin: 0;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled(Link)`
  background: ${props => props.theme.colors.background};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const ActionTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSongs: 0,
    totalArtists: 0,
    totalAlbums: 0,
    totalPlaylists: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Songs</StatTitle>
          <StatValue>{stats.totalSongs}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Artists</StatTitle>
          <StatValue>{stats.totalArtists}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Albums</StatTitle>
          <StatValue>{stats.totalAlbums}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Playlists</StatTitle>
          <StatValue>{stats.totalPlaylists}</StatValue>
        </StatCard>
      </StatsGrid>

      <h2>Quick Actions</h2>
      <ActionsGrid>
        <ActionCard to="/admin/users">
          <ActionIcon>👥</ActionIcon>
          <ActionTitle>Manage Users</ActionTitle>
        </ActionCard>
        <ActionCard to="/admin/songs/create">
          <ActionIcon>🎵</ActionIcon>
          <ActionTitle>Add New Song</ActionTitle>
        </ActionCard>
        <ActionCard to="/admin/artists/create">
          <ActionIcon>🎤</ActionIcon>
          <ActionTitle>Add New Artist</ActionTitle>
        </ActionCard>
        <ActionCard to="/admin/albums/create">
          <ActionIcon>💿</ActionIcon>
          <ActionTitle>Add New Album</ActionTitle>
        </ActionCard>
      </ActionsGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 