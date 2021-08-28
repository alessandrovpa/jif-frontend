/* eslint-disable import/no-duplicates */
import React, { useEffect, useState, useCallback } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import api from '../../../../services/api';

import { Container, Content, Table } from './styles';

interface ComponentProps {
  modality_id: number;
  resetShow(): void;
}

interface Response {
  modality: string;
  athletes: AthletesInterface[];
}
interface AthletesInterface {
  id: number;
  name: string;
  email: string;
  contact: string;
  nickname: string;
  game_id: string;
  delegation: {
    abreviation: string;
  };
}

const ShowRelatory: React.FC<ComponentProps> = ({
  modality_id,
  resetShow,
}: ComponentProps) => {
  const [athletes, setAthletes] = useState<Response>();

  const search = useCallback(() => {
    api
      .get(`/athlete?modality_id=${modality_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setAthletes(data.data));
  }, [modality_id]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <Container>
      <Content>
        <div id="title">
          {athletes && <h1>{athletes.modality}</h1>}
          <button type="button" onClick={resetShow}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Delegação</th>
              <th>Nome</th>
              <th>Nickname/Invocador</th>
              <th>ID/Zoom</th>
              <th>Contato</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {athletes &&
              athletes.athletes.map(athlete => (
                <tr key={athlete.id}>
                  <td>{athlete.delegation.abreviation}</td>
                  <td>{athlete.name}</td>
                  <td>{athlete.nickname}</td>
                  <td>{athlete.game_id}</td>
                  <td>{athlete.contact}</td>
                  <td>{athlete.email}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default ShowRelatory;
