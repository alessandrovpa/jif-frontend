import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import Button from '../../../components/Button';
import Table from '../../../components/Table';

import FunctionForm from './FunctionForm';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface FunctionInterface {
  id: string;
  name: string;
  access: number;
}

const userFunctions = [
  'Administrador',
  'Secretaria',
  'Chefe de delegação',
  'Técnico de modalidade',
  'Servidor',
];

interface OpenForm {
  id?: string;
  open: boolean;
}

const UserFunction: React.FC = () => {
  const [functions, setFunctions] = useState<FunctionInterface[]>([]);
  const [openForm, setOpenForm] = useState<OpenForm>({ id: '', open: false });
  const { addToast } = useContext(ToastContext);

  const searchFunctions = useCallback(async () => {
    try {
      const res = await api.get('/function', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        setFunctions(res.data);
      } else {
        setFunctions([]);
      }
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [setFunctions, addToast]);

  const openCreateForm = useCallback(() => {
    setOpenForm({ id: '', open: true });
  }, []);

  const resetOpenForm = useCallback(() => {
    setOpenForm({ id: '', open: false });
    searchFunctions();
  }, [searchFunctions, setOpenForm]);

  useEffect(() => {
    searchFunctions();
  }, [searchFunctions]);

  return (
    <Container>
      {!openForm.open && (
        <Content>
          <h1>Funções cadastradas</h1>
          <Button onClick={() => openCreateForm()}>Cadastrar</Button>
        </Content>
      )}
      {!openForm.open && functions && (
        <Content>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Acesso</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {functions.map(f => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{userFunctions[f.access]}</td>
                  <td>
                    <Button>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Content>
      )}

      {openForm && openForm.open && (
        <Content>
          <FunctionForm
            id={openForm.id ? openForm.id : ''}
            resetShowForm={resetOpenForm}
          />
        </Content>
      )}
    </Container>
  );
};

export default UserFunction;
