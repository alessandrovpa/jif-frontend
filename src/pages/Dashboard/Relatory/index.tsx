import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import { ToastContext } from '../../../context/ToastContext';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import ShowRelatory from './ShowRelatory';
import Select, { OptionsProps } from '../../../components/Select';
import Button from '../../../components/Button';

import api from '../../../services/api';

import { Container, Content } from './styles';

interface ModalityInterface {
  id: string;
  name: string;
  genre: string;
  value: string;
}

interface ListAthletesFormData {
  modality_id: number;
}

const Relatory: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [openFullRelatory, setOpenFullRelatory] = useState<number>();
  const [modalities, setModalities] = useState<OptionsProps[]>([]);
  const formRef = useRef<FormHandles>(null);

  const getModalities = useCallback(async () => {
    try {
      const res = await api.get('/modality', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (res.data.length > 0) {
        res.data.map((modality: ModalityInterface) => {
          modality[
            'name'
          ] = `${modality.name.toUpperCase()} - ${modality.genre.toUpperCase()}`;
          modality['value'] = modality.id;
          return modality;
        });
        setModalities(res.data);
      } else {
        setModalities([]);
      }
      setModalities(res.data);
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [addToast]);

  const searchByModality = useCallback(async (data?: ListAthletesFormData) => {
    if (data) {
      setOpenFullRelatory(data.modality_id);
      console.log(data);
    }
  }, []);

  const resetOpenRelatory = useCallback(() => {
    setOpenFullRelatory(undefined);
  }, []);

  useEffect(() => {
    getModalities();
  }, [getModalities]);

  return (
    <Container>
      <Content>
        <h1>Relatório de inscrições</h1>
        {!openFullRelatory && (
          <Form ref={formRef} onSubmit={searchByModality}>
            <h2>Buscar por delegação</h2>
            <Select id="modality_id" name="modality_id" options={modalities}>
              Delegação
            </Select>
            <Button type="submit">Buscar</Button>
          </Form>
        )}
        {openFullRelatory && (
          <ShowRelatory
            modality_id={openFullRelatory}
            resetShow={resetOpenRelatory}
          />
        )}
      </Content>
    </Container>
  );
};

export default Relatory;
