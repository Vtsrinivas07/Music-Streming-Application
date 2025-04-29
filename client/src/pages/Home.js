import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Components
import SongList from '../components/songs/SongList';
import PlaylistGrid from '../components/playlists/PlaylistGrid';
import ArtistGrid from '../components/artists/ArtistGrid';
import AlbumGrid from '../components/albums/AlbumGrid';

const HomeContainer = styled.div`
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const ViewAllLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.9rem;
  margin-left: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Home = () => {
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [songsRes, playlistsRes, artistsRes, albumsRes] = await Promise.all([
          axios.get('/api/songs/featured'),
          axios.get('/api/playlists/featured'),
          axios.get('/api/artists/featured'),
          axios.get('/api/albums/featured')
        ]);

        setFeaturedSongs(songsRes.data.data);
        setFeaturedPlaylists(playlistsRes.data.data);
        setFeaturedArtists(artistsRes.data.data);
        setFeaturedAlbums(albumsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured content:', err);
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <HomeContainer>
      <Section>
        <SectionTitle>
          Featured Songs
          <ViewAllLink to="/browse">View All</ViewAllLink>
        </SectionTitle>
        <SongList songs={featuredSongs} showHeader={false} />
      </Section>

      <Section>
        <SectionTitle>
          Featured Playlists
          <ViewAllLink to="/playlists">View All</ViewAllLink>
        </SectionTitle>
        <PlaylistGrid playlists={featuredPlaylists} />
      </Section>

      <Section>
        <SectionTitle>
          Featured Artists
          <ViewAllLink to="/browse?type=artists">View All</ViewAllLink>
        </SectionTitle>
        <ArtistGrid artists={featuredArtists} />
      </Section>

      <Section>
        <SectionTitle>
          Featured Albums
          <ViewAllLink to="/browse?type=albums">View All</ViewAllLink>
        </SectionTitle>
        <AlbumGrid albums={featuredAlbums} />
      </Section>
    </HomeContainer>
  );
};

export default Home; 