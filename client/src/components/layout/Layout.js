import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../player/MusicPlayer';
import { PlayerProvider } from '../../context/PlayerContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
`;

const Layout = () => {
  return (
    <PlayerProvider>
      <LayoutContainer>
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
        <Player />
      </LayoutContainer>
    </PlayerProvider>
  );
};

export default Layout; 