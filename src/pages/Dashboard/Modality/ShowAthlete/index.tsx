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
  id: string;
  resetShow(): void;
}

interface AthleteInterface {
  name: string;
  email: string;
  birth: string;
  identity: string;
  contact: string;
  nickname: string;
  game_id: string;
  observation?: string;
  image_url: string;
  status: number;
  modalities: [
    {
      id: string;
      name: string;
    },
  ];
  delegation: {
    name: string;
  };
  picture_url: string;
  document_url: string;
  document_back_url: string;
  authorization_url?: string;
}

const ShowPerson: React.FC<ComponentProps> = ({ id, resetShow }) => {
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const [athlete, setAthlete] = useState<AthleteInterface>();

  const search = useCallback(() => {
    api
      .get(`/athlete?athlete_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setAthlete(data.data));
  }, [id]);

  useEffect(() => {
    search();
  }, [search]);

  const formatDate = useCallback((date: string) => {
    const formattedDate = format(parseISO(date), 'dd/MM/yyyy');
    return formattedDate;
  }, []);

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>{athlete?.name}</h1>
          <button type="button" onClick={resetShow}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="items">
          <Table>
            <tbody>
              <tr>
                <th>Email</th>
                <td>{athlete?.email}</td>
              </tr>
              <tr>
                <th>Identidade</th>
                <td>{athlete?.identity}</td>
              </tr>
              <tr>
                <th>Contato</th>
                <td>{athlete?.contact}</td>
              </tr>
              <tr>
                <th>Data de Nascimento</th>
                <td>{athlete?.birth && formatDate(athlete?.birth)}</td>
              </tr>
              <tr>
                <th>Nickname/Invocador</th>
                <td>{athlete?.nickname}</td>
              </tr>
              <tr>
                <th>ID/Nome do Zoom</th>
                <td>{athlete?.game_id}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div id="modalities">
          <h1>Modalidades</h1>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {athlete?.modalities.map(modality => (
                <tr key={modality.id}>
                  <td>
                    <strong>{modality.name}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div id="documents">
          <h1>Documentos</h1>
          <img src={athlete?.picture_url} alt="Foto de Perfil" />
          <img src={athlete?.document_url} alt="Foto da frente do documento" />
          <img
            src={athlete?.document_back_url}
            alt="Foto do verso do documento"
          />
          {athlete?.authorization_url && (
            <img
              src={athlete?.authorization_url}
              alt="Foto da autorização parental"
            />
          )}
        </div>
      </Content>
    </Container>
  );
};

export default ShowPerson;
