import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled(Button)`
  padding: 0.5rem;
  margin-right: 0.5rem;
`;

const AdminTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <Th key={index}>{column.header}</Th>
          ))}
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column, index) => (
              <Td key={index}>
                {column.render ? column.render(item) : item[column.key]}
              </Td>
            ))}
            <Td>
              <ActionButton variant="secondary" onClick={() => onEdit(item)}>
                <FaEdit />
              </ActionButton>
              <ActionButton variant="danger" onClick={() => onDelete(item)}>
                <FaTrash />
              </ActionButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminTable; 