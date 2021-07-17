import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import UserForm from './UserForm';

import Button from '../../../components/Button';
import Table from '../../../components/Table';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface UserInterface {
  id: string;
  name: string;
  siape: string;
  delegation: {
    name: string;
  };
}

const User: React.FC = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const { addToast } = useContext(ToastContext);
  const [openForm, setOpenForm] = useState(false);

  const searchUsers = useCallback(async () => {
    try {
      const res = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [setUsers, addToast]);

  const resetOpenForm = useCallback(() => {
    setOpenForm(false);
    searchUsers();
  }, [searchUsers, setOpenForm]);

  const deleteUser = useCallback(
    async user_id => {
      const result = window.confirm('Deseja remover este usuário?');
      if (result) {
        try {
          await api.delete('/user', {
            data: { user_id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
            },
          });
        } catch (err) {
          addToast({
            type: err.response.data.status,
            title: 'Error',
            description: err.response.data.message,
          });
        }
        searchUsers();
      }
    },
    [searchUsers],
  );

  useEffect(() => {
    searchUsers();
  }, [setUsers, searchUsers]);

  return (
    <Container>
      {!openForm && (
        <Content>
          <h1>Usuários cadastrados</h1>
          <Button onClick={() => setOpenForm(true)}>Cadastrar</Button>
        </Content>
      )}
      {!openForm && users && (
        <Content>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Siape</th>
                <th>Delegação</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.siape}</td>
                  <td>{u.delegation.name}</td>
                  <td>
                    <Button onClick={() => deleteUser(u.id)}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Content>
      )}

      {openForm && (
        <Content>
          <UserForm resetShowForm={resetOpenForm} />
        </Content>
      )}
    </Container>
  );
};

export default User;
