import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import Button from '../../../components/Button';
import Table from '../../../components/Table';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface Relatory {
  delegation: string;
  relatory: {
    modality: string;
    count: number;
  }[];
}

const Relatory: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [relatory, setRelatory] = useState<Relatory[]>([]);

  const getRelatory = useCallback(async () => {
    try {
      const res = await api.get('/relatory/modalities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      setRelatory(res.data);
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [addToast]);

  useEffect(() => {
    getRelatory();
  }, [getRelatory]);

  return (
    <Container>
      <Content>
        <h1>Relatório de inscrições</h1>
        {relatory &&
          relatory.map(delegationRelatory => (
            <Table key={delegationRelatory.delegation}>
              <thead>
                <tr>
                  <th colSpan={2}>{delegationRelatory.delegation}</th>
                </tr>
              </thead>
              <tbody>
                {delegationRelatory.relatory.map(modalityRelatory => (
                  <tr key={modalityRelatory.modality}>
                    <td>{modalityRelatory.modality}</td>
                    <td>{modalityRelatory.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
      </Content>
    </Container>
  );
};

export default Relatory;
