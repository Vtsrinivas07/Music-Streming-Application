import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch, FaMusic, FaHeart, FaList, FaUser, FaSignOutAlt, FaTools } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: var(--sidebar-bg);
  height: 100%;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const Logo = styled.div`
  padding: 25px 20px;
  display: flex;
  align-items: center;

  h1 {
    font-size: 24px;
    margin-left: 10px;
    color: var(--primary-color);

    @media (max-width: 768px) {
      display: none;
    }
  }

  .logo-icon {
    color: var(--primary-color);
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
    border-left: 3px solid var(--primary-color);
    background-color: rgba(255, 255, 255, 0.05);
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

const UserSection = styled.div`
  padding: 20px;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
`;

const UserLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: #aaa;
  transition: all 0.3s ease;

  &:hover {
    color: var(--text-color);
  }

  .user-icon {
    font-size: 18px;
    margin-right: 15px;
  }

  .user-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 12px 0;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }

  .logout-icon {
    font-size: 18px;
    margin-right: 15px;
  }

  .logout-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const LoginButton = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--primary-dark);
  }

  @media (max-width: 768px) {
    padding: 8px;
  }

  .login-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const AdminLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: #ff4444;
  transition: all 0.3s ease;
  margin-bottom: 10px;

  &:hover {
    color: #ff6666;
  }

  .admin-icon {
    font-size: 18px;
    margin-right: 15px;
  }

  .admin-text {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Sidebar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  return (
    <SidebarContainer>
      <Logo>
        <FaMusic className="logo-icon" />
        <h1>BeatBox</h1>
      </Logo>

      <NavMenu>
        <NavItem to="/">
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavItem>
        <NavItem to="/browse">
          <FaMusic className="nav-icon" />
          <span className="nav-text">Browse</span>
        </NavItem>
        <NavItem to="/search">
          <FaSearch className="nav-icon" />
          <span className="nav-text">Search</span>
        </NavItem>
        <NavItem to="/playlists">
          <FaList className="nav-icon" />
          <span className="nav-text">Playlists</span>
        </NavItem>
        <NavItem to="/favorites">
          <FaHeart className="nav-icon" />
          <span className="nav-text">Favorites</span>
        </NavItem>
      </NavMenu>

      <UserSection>
        {user ? (
          <>
            {isAdmin && (
              <AdminLink to="/admin">
                <FaTools className="admin-icon" />
                <span className="admin-text">Admin Dashboard</span>
              </AdminLink>
            )}
            <UserLink to="/profile">
              <FaUser className="user-icon" />
              <span className="user-text">{user.username}</span>
            </UserLink>
            <LogoutButton onClick={logoutUser}>
              <FaSignOutAlt className="logout-icon" />
              <span className="logout-text">Logout</span>
            </LogoutButton>
          </>
        ) : (
          <LoginButton to="/login">
            <span className="login-text">Login</span>
          </LoginButton>
        )}
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar; 