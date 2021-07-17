import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import Button from '../../../components/Button';
import Table from '../../../components/Table';
import DelegationForm from './DelegationForm';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface DelegationInterface {
  id: string;
  name: string;
  abreviation: string;
}

interface OpenForm {
  id?: string;
  open: boolean;
}

const Delegation: React.FC = () => {
  const [delegations, setDelegations] = useState<DelegationInterface[]>([]);
  const [openForm, setOpenForm] = useState<OpenForm>({ id: '', open: false });
  const { addToast } = useContext(ToastContext);

  const searchDelegation = useCallback(async () => {
    try {
      const res = await api.get('/delegation', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        setDelegations(res.data);
      } else {
        setDelegations([]);
      }
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [setDelegations, addToast]);

  const openCreateForm = useCallback(() => {
    setOpenForm({ id: '', open: true });
  }, []);

  const resetOpenForm = useCallback(() => {
    setOpenForm({ id: '', open: false });
    searchDelegation();
  }, [searchDelegation, setOpenForm]);

  const deleteDelegation = useCallback(
    async delegation_id => {
      const result = window.confirm('Deseja remover esta delegação?');
      if (result) {
        try {
          await api.delete('/delegation', {
            data: { delegation_id },
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

        searchDelegation();
      }
    },
    [searchDelegation],
  );

  useEffect(() => {
    searchDelegation();
  }, [searchDelegation]);

  return (
    <Container>
      {!openForm.open && (
        <Content>
          <h1>Delegações cadastradas</h1>
          <Button onClick={() => openCreateForm()}>Cadastrar</Button>
        </Content>
      )}

      {!openForm.open && delegations && (
        <Content>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Abreviação</th>
                <th>Editar</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {delegations.map(d => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.abreviation}</td>
                  <td>
                    <Button>Editar</Button>
                  </td>
                  <td>
                    <Button onClick={() => deleteDelegation(d.id)}>
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Content>
      )}
      {openForm && openForm.open && (
        <Content>
          <DelegationForm
            id={openForm.id ? openForm.id : ''}
            resetShowForm={resetOpenForm}
          />
        </Content>
      )}
    </Container>
  );
};

export default Delegation;
