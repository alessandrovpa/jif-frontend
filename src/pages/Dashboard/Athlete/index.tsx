import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { ToastContext } from '../../../context/ToastContext';

import ShowAthlete from './ShowAthlete';
import AthleteForm from './AthleteForm';
import Button from '../../../components/Button';

import Select, { OptionsProps } from '../../../components/Select';
import Table from '../../../components/Table';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface ShowInterface {
  id: string;
}

interface PersonInterface {
  id: string;
  identity: string;
  name: string;
  status: number;
}

interface SearchAthleteFormData {
  delegation_id: string;
}

interface DelegationInterface {
  id: string;
  name: string;
  value: string;
}

interface OpenForm {
  id?: string;
  open: boolean;
}

const status = ['Em análise', 'Aprovado(a)', 'Reprovado(a)'];

const Athlete: React.FC = () => {
  const [athletes, setAthletes] = useState<PersonInterface[]>();
  const [show, setShow] = useState<ShowInterface>();
  const [openForm, setOpenForm] = useState<OpenForm>({ id: '', open: false });
  const [searchDelegationId, setSearchDelegationId] = useState<string>();
  const [delegations, setDelegations] = useState<OptionsProps[]>([]);
  const [access, setAccess] = useState<Number>(0);
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);

  const searchByDelegation = useCallback(
    async (data?: SearchAthleteFormData) => {
      setShow(undefined);
      let url = '/athlete';
      if (data) {
        setSearchDelegationId(data.delegation_id);
        return;
      }
      if (searchDelegationId) {
        url += `?delegation_id=${searchDelegationId}`;
      }
      setAthletes([]);
      try {
        const res = await api.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        });
        if (res.data.length > 0) {
          setAthletes(res.data);
        } else {
          setAthletes([]);
        }
      } catch (err) {
        addToast({
          type: err.response.data.status,
          title: 'Error',
          description: err.response.data.message,
        });
      }
    },
    [addToast, searchDelegationId],
  );

  const searchDelegation = useCallback(async () => {
    try {
      const getAccess = await api.get('/user/access', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      setAccess(getAccess.data.access);
      const res = await api.get('/delegation', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        res.data.map((delegation: DelegationInterface) => {
          delegation['value'] = delegation.id;
          return delegation;
        });
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
  }, [setDelegations, setAccess, addToast]);

  useEffect(() => {
    searchDelegation();
    searchByDelegation();
  }, [searchByDelegation, searchDelegation]);

  const handleClick = useCallback((id: string) => {
    setShow({ id });
  }, []);

  const resetShow = useCallback(() => {
    setShow(undefined);
    searchByDelegation();
  }, [searchByDelegation]);

  const resetOpenForm = useCallback(() => {
    setOpenForm({ id: '', open: false });
    searchByDelegation();
  }, [searchByDelegation]);

  const openCreateForm = useCallback(() => {
    setOpenForm({ id: '', open: true });
  }, []);

  const deleteAthlete = useCallback(
    async athlete_id => {
      const result = window.confirm('Deseja remover este atleta?');
      if (result) {
        try {
          await api.delete('/athlete', {
            data: { athlete_id },
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

        searchByDelegation();
      }
    },
    [searchByDelegation],
  );

  return (
    <Container>
      {access <= 1 && (
        <Content>
          <Form ref={formRef} onSubmit={searchByDelegation}>
            <h2>Buscar por delegação</h2>
            <Select
              id="delegation_id"
              name="delegation_id"
              options={delegations}
            >
              Delegação
            </Select>
            <Button type="submit">Buscar</Button>
          </Form>
        </Content>
      )}

      {athletes && athletes.length === 0 && (
        <Content>
          <h1>Nenhum atleta!</h1>
          {access > 1 && (
            <Button onClick={() => openCreateForm()}>Cadastrar</Button>
          )}
        </Content>
      )}
      {athletes && athletes.length > 0 && !show && !openForm.open && (
        <Content>
          <div id="contentHeader">
            <h1>Atletas cadastrados</h1>
            {access >= 2 && (
              <Button onClick={() => openCreateForm()}>Cadastrar</Button>
            )}
          </div>

          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Documento</th>
                <th>Status</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map(p => (
                <tr key={p.id}>
                  <td onClick={() => handleClick(p.id)}>{p.name}</td>
                  <td onClick={() => handleClick(p.id)}>{p.identity}</td>
                  <td onClick={() => handleClick(p.id)}>{status[p.status]}</td>
                  <td>
                    <Button onClick={() => deleteAthlete(p.id)}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Content>
      )}

      {show && (
        <Content>
          <ShowAthlete id={show.id} resetShow={resetShow} />
        </Content>
      )}

      {openForm && openForm.open && (
        <Content>
          <AthleteForm
            id={openForm.id ? openForm.id : ''}
            resetShowForm={resetOpenForm}
          />
        </Content>
      )}
    </Container>
  );
};

export default Athlete;
