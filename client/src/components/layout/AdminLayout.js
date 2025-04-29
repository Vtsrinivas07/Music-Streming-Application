import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUsers, FaMusic, FaGuitar, FaCompactDisc, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const AdminSidebar = styled.div`
  width: 250px;
  background-color: #1a1a1a;
  height: 100%;
  color: var(--text-color);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const Logo = styled.div`
  padding: 25px 20px;
  display: flex;
  align-items: center;
  background-color: var(--primary-color);

  h1 {
    font-size: 20px;
    margin-left: 10px;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .logo-icon {
    font-size: 24px;
  }
`;

const NavMenu = styled.nav`
  margin-top: 20px;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #aaa;
  transition: all 0.3s ease;

  &:hover {
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: var(--primary-color);
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid var(--primary-color);
  }

  .nav-icon {
    font-size: 18px;
    margin-right: 15px;
  }

  .nav-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const ButtonsContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #333;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 12px 0;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }

  .button-icon {
    font-size: 18px;
    margin-right: 15px;
  }

  .button-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  background-color: var(--background-color);
`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <LayoutContainer>
      <AdminSidebar>
        <Logo>
          <FaMusic className="logo-icon" />
          <h1>BeatBox Admin</h1>
        </Logo>

        <NavMenu>
          <NavItem to="/admin">
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavItem>
          <NavItem to="/admin/users">
            <FaUsers className="nav-icon" />
            <span className="nav-text">Users</span>
          </NavItem>
          <NavItem to="/admin/songs">
            <FaMusic className="nav-icon" />
            <span className="nav-text">Songs</span>
          </NavItem>
          <NavItem to="/admin/artists">
            <FaGuitar className="nav-icon" />
            <span className="nav-text">Artists</span>
          </NavItem>
          <NavItem to="/admin/albums">
            <FaCompactDisc className="nav-icon" />
            <span className="nav-text">Albums</span>
          </NavItem>
        </NavMenu>

        <ButtonsContainer>
          <Button onClick={() => navigate('/')}>
            <FaArrowLeft className="button-icon" />
            <span className="button-text">Back to App</span>
          </Button>
          <Button onClick={handleLogout}>
            <FaSignOutAlt className="button-icon" />
            <span className="button-text">Logout</span>
          </Button>
        </ButtonsContainer>
      </AdminSidebar>

      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout; 