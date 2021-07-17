import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';

import Button from '../../../components/Button';
import Table from '../../../components/Table';

import ModalityForm from './ModalityForm';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface ModalityInterface {
  id: string;
  name: string;
  genre: string;
  holder: number;
  backup: number;
}

interface OpenForm {
  id?: string;
  open: boolean;
}

const Modality: React.FC = () => {
  const [modalities, setModalities] = useState<ModalityInterface[]>([]);
  const [openForm, setOpenForm] = useState<OpenForm>({ id: '', open: false });
  const { addToast } = useContext(ToastContext);

  const searchModalities = useCallback(async () => {
    try {
      const res = await api.get('/modality', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        setModalities(res.data);
      } else {
        setModalities([]);
      }
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [setModalities, addToast]);

  const openCreateForm = useCallback(() => {
    setOpenForm({ id: '', open: true });
  }, []);

  const resetOpenForm = useCallback(() => {
    setOpenForm({ id: '', open: false });
    searchModalities();
  }, [searchModalities, setOpenForm]);

  const deleteModality = useCallback(
    async modality_id => {
      const result = window.confirm('Deseja remover esta modalidade?');
      if (result) {
        try {
          await api.delete('/modality', {
            data: { modality_id },
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

        searchModalities();
      }
    },
    [searchModalities, addToast],
  );

  useEffect(() => {
    searchModalities();
  }, [searchModalities]);

  return (
    <Container>
      {!openForm.open && (
        <Content>
          <h1>Modalidades cadastradas</h1>
          <Button onClick={() => openCreateForm()}>Cadastrar</Button>
        </Content>
      )}

      {!openForm.open && modalities && (
        <Content>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Gênero</th>
                <th>Títulares</th>
                <th>Reservas</th>
                <th>Editar</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {modalities.map(m => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.genre}</td>
                  <td>{m.holder}</td>
                  <td>{m.backup}</td>
                  <td>
                    <Button>Editar</Button>
                  </td>
                  <td>
                    <Button onClick={() => deleteModality(m.id)}>
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
          <ModalityForm
            id={openForm.id ? openForm.id : ''}
            resetShowForm={resetOpenForm}
          />
        </Content>
      )}
    </Container>
  );
};

export default Modality;
