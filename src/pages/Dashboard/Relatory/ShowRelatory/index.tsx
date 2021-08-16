/* eslint-disable import/no-duplicates */
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { parseISO, format } from 'date-fns';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../../../services/api';
import { ToastContext } from '../../../../context/ToastContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';

import { Container, Content, Table } from './styles';

interface ComponentProps {
  delegation_id: number;
  modality_id: number;
  delegation: string;
  modality: string;
  resetShow(): void;
}

interface AthletesInterface {
  id: number;
  name: string;
  identity: string;
}

const ShowRelatory: React.FC<ComponentProps> = ({
  delegation_id,
  modality_id,
  delegation,
  modality,
  resetShow,
}: ComponentProps) => {
  const [athletes, setAthletes] = useState<AthletesInterface[]>();

  const search = useCallback(() => {
    api
      .get(
        `/athlete?delegation_id=${delegation_id}&modality_id=${modality_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        },
      )
      .then(data => setAthletes(data.data));
  }, [delegation_id, modality_id]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>{delegation}</h1>
          <button type="button" onClick={resetShow}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <h2>{modality}</h2>

        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Identidade</th>
            </tr>
          </thead>
          <tbody>
            {athletes &&
              athletes.map(athlete => (
                <tr key={athlete.id}>
                  <td>{athlete.name}</td>
                  <td>{athlete.identity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default ShowRelatory;
