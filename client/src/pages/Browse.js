import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// Components
import SongList from '../components/songs/SongList';
import PlaylistGrid from '../components/playlists/PlaylistGrid';
import ArtistGrid from '../components/artists/ArtistGrid';
import AlbumGrid from '../components/albums/AlbumGrid';

const BrowseContainer = styled.div`
  padding: 2rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.hover};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ContentContainer = styled.div`
  margin-top: 2rem;
`;

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState(searchParams.get('type') || 'songs');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/songs';
        switch (type) {
          case 'playlists':
            endpoint = '/api/playlists';
            break;
          case 'artists':
            endpoint = '/api/artists';
            break;
          case 'albums':
            endpoint = '/api/albums';
            break;
          default:
            endpoint = '/api/songs';
        }

        const res = await axios.get(endpoint);
        setContent(res.data.data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setSearchParams({ type: newType });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContent = React.useMemo(() => {
    if (!Array.isArray(content)) return [];
    
    return content.filter(item => {
      if (!item) return false;
      
      const searchLower = searchTerm.toLowerCase();
      try {
        switch (type) {
          case 'songs':
            return (
              (item.title && typeof item.title === 'string' && item.title.toLowerCase().includes(searchLower)) ||
              (item.artist && item.artist.name && typeof item.artist.name === 'string' && item.artist.name.toLowerCase().includes(searchLower))
            );
          case 'playlists':
            return item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(searchLower);
          case 'artists':
            return item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(searchLower);
          case 'albums':
            return (
              (item.title && typeof item.title === 'string' && item.title.toLowerCase().includes(searchLower)) ||
              (item.artist && item.artist.name && typeof item.artist.name === 'string' && item.artist.name.toLowerCase().includes(searchLower))
            );
          default:
            return true;
        }
      } catch (error) {
        console.error('Error filtering content:', error);
        return false;
      }
    });
  }, [content, searchTerm, type]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowseContainer>
      <Filters>
        <FilterButton
          active={type === 'songs'}
          onClick={() => handleTypeChange('songs')}
        >
          Songs
        </FilterButton>
        <FilterButton
          active={type === 'playlists'}
          onClick={() => handleTypeChange('playlists')}
        >
          Playlists
        </FilterButton>
        <FilterButton
          active={type === 'artists'}
          onClick={() => handleTypeChange('artists')}
        >
          Artists
        </FilterButton>
        <FilterButton
          active={type === 'albums'}
          onClick={() => handleTypeChange('albums')}
        >
          Albums
        </FilterButton>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Filters>

      <ContentContainer>
        {type === 'songs' && <SongList songs={filteredContent} />}
        {type === 'playlists' && <PlaylistGrid playlists={filteredContent} />}
        {type === 'artists' && <ArtistGrid artists={filteredContent} />}
        {type === 'albums' && <AlbumGrid albums={filteredContent} />}
      </ContentContainer>
    </BrowseContainer>
  );
};

export default Browse; 