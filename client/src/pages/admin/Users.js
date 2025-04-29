import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { FaUserPlus } from 'react-icons/fa';
import { getUsers, deleteUser, createUser, updateUser } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import UserModal from '../../components/admin/UserModal';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: red;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(user._id);
        setUsers(users.filter(u => u._id !== user._id));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser._id, formData);
        setUsers(users.map(u => 
          u._id === selectedUser._id ? updatedUser : u
        ));
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
      }
      setModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      throw new Error('Failed to save user. Please try again.');
    }
  };

  const columns = [
    { header: 'Username', key: 'username' },
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
  ];

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Users</Title>
        <Button variant="primary" onClick={handleCreate}>
          <FaUserPlus /> Add User
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <UserModal
          user={selectedUser}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </Container>
  );
};

export default Users; 