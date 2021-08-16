import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import ShowRelatory from './ShowRelatory';

import Table from '../../../components/Table';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface Relatory {
  delegation_id: number;
  delegation: string;
  relatory: {
    modality_id: number;
    modality: string;
    count: number;
  }[];
}

interface OpenFullRelatory {
  delegation_id: number;
  modality_id: number;
  delegation: string;
  modality: string;
}

const Relatory: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [relatory, setRelatory] = useState<Relatory[]>([]);
  const [openFullRelatory, setOpenFullRelatory] = useState<OpenFullRelatory>(
    {} as OpenFullRelatory,
  );

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

  const openRelatory = useCallback(
    (delegation_id, modality_id, delegation, modality) => {
      setOpenFullRelatory({ delegation, delegation_id, modality, modality_id });
    },
    [],
  );

  const resetOpenRelatory = useCallback(() => {
    setOpenFullRelatory({} as OpenFullRelatory);
  }, []);

  useEffect(() => {
    getRelatory();
  }, [getRelatory]);

  return (
    <Container>
      <Content>
        <h1>Relatório de inscrições</h1>
        {relatory &&
          !openFullRelatory.delegation &&
          relatory.map(delegationRelatory => (
            <Table key={delegationRelatory.delegation}>
              <thead>
                <tr>
                  <th colSpan={2}>{delegationRelatory.delegation}</th>
                </tr>
              </thead>
              <tbody>
                {delegationRelatory.relatory.map(modalityRelatory => (
                  <tr
                    key={modalityRelatory.modality}
                    onClick={() =>
                      openRelatory(
                        delegationRelatory.delegation_id,
                        modalityRelatory.modality_id,
                        delegationRelatory.delegation,
                        modalityRelatory.modality,
                      )
                    }
                  >
                    <td>{modalityRelatory.modality}</td>
                    <td>{modalityRelatory.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
        {openFullRelatory.delegation && (
          <ShowRelatory
            delegation_id={openFullRelatory.delegation_id}
            modality_id={openFullRelatory.modality_id}
            delegation={openFullRelatory.delegation}
            modality={openFullRelatory.modality}
            resetShow={resetOpenRelatory}
          />
        )}
      </Content>
    </Container>
  );
};

export default Relatory;
