/* eslint-disable import/no-duplicates */
import React, { useEffect, useState, useCallback } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import api from '../../../../services/api';
import Button from '../../../../components/Button';

import { Container, Content, Table } from './styles';

interface ComponentProps {
  id: string;
  resetShow(): void;
}

interface UserInterface {
  name: string;
  email: string;
  siape: string;
  contact: string;
  function: string;
  delegation: {
    name: string;
  };
  portaria_url: string;
  document_url: string;
  document_back_url: string;
}

const ShowUser: React.FC<ComponentProps> = ({ id, resetShow }) => {
  const [user, setUser] = useState<UserInterface>();

  const search = useCallback(() => {
    api
      .get(`/user?user_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setUser(data.data));
  }, [id]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>{user?.name}</h1>
          <button type="button" onClick={resetShow}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="items">
          <Table>
            <tbody>
              <tr>
                <th>Email</th>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <th>Siape</th>
                <td>{user?.siape}</td>
              </tr>
              <tr>
                <th>Contato</th>
                <td>{user?.contact}</td>
              </tr>
              <tr>
                <th>Função</th>
                <td>{user?.function}</td>
              </tr>
              <tr>
                <th>Delegação</th>
                <td>{user?.delegation.name}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div id="documents">
          <h1>Documentos</h1>
          {user?.portaria_url && user?.portaria_url.split('.').pop() === 'pdf' && (
            <a href={user.portaria_url} target="_blank">
              <Button>Ver Portaria</Button>
            </a>
          )}
          {user?.portaria_url &&
            user?.portaria_url.split('.').pop() != 'pdf' && (
              <img src={user?.portaria_url} alt="Portaria" />
            )}

          <img src={user?.document_url} alt="Foto da frente do documento" />
          <img src={user?.document_back_url} alt="Foto do verso do documento" />
        </div>
      </Content>
    </Container>
  );
};

export default ShowUser;
