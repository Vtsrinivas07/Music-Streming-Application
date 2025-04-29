import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ArtistCard = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ArtistImage = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background: #282828;
  border-radius: 50%;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArtistName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  text-align: center;
  color: #fff;
  margin-top: 12px;
  font-weight: 600;
`;

const defaultArtistImage = '/images/default-artist.jpg';

const ArtistGrid = ({ artists }) => {
  return (
    <Grid>
      {artists.map(artist => (
        <ArtistCard key={artist._id} to={`/artist/${artist._id}`}>
          <ArtistImage>
            <img 
              src={artist.image ? `/uploads/${artist.image}` : defaultArtistImage} 
              alt={artist.name} 
              onError={(e) => {
                e.target.src = defaultArtistImage;
              }}
            />
          </ArtistImage>
          <ArtistName>{artist.name}</ArtistName>
        </ArtistCard>
      ))}
    </Grid>
  );
};

export default ArtistGrid; 