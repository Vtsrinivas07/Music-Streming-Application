import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const AlbumCard = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const AlbumCover = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background: #282828;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AlbumInfo = styled.div`
  text-align: center;
`;

const AlbumTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 600;
`;

const ArtistName = styled.p`
  margin: 0;
  color: #b3b3b3;
  font-size: 0.9rem;
  
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const defaultAlbumCover = '/images/default-album.jpg';

const AlbumGrid = ({ albums }) => {
  return (
    <Grid>
      {albums.map(album => (
        <AlbumCard key={album._id} to={`/album/${album._id}`}>
          <AlbumCover>
            <img 
              src={album.coverImage ? `/uploads/${album.coverImage}` : defaultAlbumCover} 
              alt={album.title}
              onError={(e) => {
                e.target.src = defaultAlbumCover;
              }}
            />
          </AlbumCover>
          <AlbumInfo>
            <AlbumTitle>{album.title}</AlbumTitle>
            <ArtistName>{album.artist?.name || 'Unknown Artist'}</ArtistName>
          </AlbumInfo>
        </AlbumCard>
      ))}
    </Grid>
  );
};

export default AlbumGrid; 