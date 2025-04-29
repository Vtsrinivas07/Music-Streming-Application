import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import SongList from '../components/songs/SongList';
import ArtistGrid from '../components/artists/ArtistGrid';
import AlbumGrid from '../components/albums/AlbumGrid';
import PlaylistGrid from '../components/playlists/PlaylistGrid';

const Container = styled.div`
  padding: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 2rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const search = async () => {
      if (!query) {
        setResults({
          songs: [],
          artists: [],
          albums: [],
          playlists: []
        });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to perform search');
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  if (error) return <div>{error}</div>;

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Search for songs, artists, albums, or playlists..."
        value={query}
        onChange={handleSearch}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {results.songs.length > 0 && (
            <Section>
              <SectionTitle>Songs</SectionTitle>
              <SongList songs={results.songs} />
            </Section>
          )}

          {results.artists.length > 0 && (
            <Section>
              <SectionTitle>Artists</SectionTitle>
              <ArtistGrid artists={results.artists} />
            </Section>
          )}

          {results.albums.length > 0 && (
            <Section>
              <SectionTitle>Albums</SectionTitle>
              <AlbumGrid albums={results.albums} />
            </Section>
          )}

          {results.playlists.length > 0 && (
            <Section>
              <SectionTitle>Playlists</SectionTitle>
              <PlaylistGrid playlists={results.playlists} />
            </Section>
          )}

          {!loading && query && Object.values(results).every(arr => arr.length === 0) && (
            <div>No results found for "{query}"</div>
          )}
        </>
      )}
    </Container>
  );
};

export default Search; 