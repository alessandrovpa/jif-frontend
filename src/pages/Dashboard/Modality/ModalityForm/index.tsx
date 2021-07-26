/* eslint-disable import/no-duplicates */
import React, { useState, useCallback, useRef, useContext } from 'react';
import * as Yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../../../services/api';
import { ToastContext } from '../../../../context/ToastContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { FaUserAlt, FaUserCheck } from 'react-icons/fa';
import getValidationErrors from '../../../../utils/getValidationErrors';
import { GiBackup } from 'react-icons/gi';
import { IoIosMan, IoIosWoman } from 'react-icons/io';
import { ImManWoman } from 'react-icons/im';

import { Container, Content } from './styles';

interface ComponentProps {
  id?: string;
  resetShowForm(): void;
}

interface ModalityInterface {
  name: string;
  genre: 'masculino' | 'feminino ' | 'misto';
  holder: number;
  backup: number;
}

const ModalityForm: React.FC<ComponentProps> = ({ id, resetShowForm }) => {
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const [modality, setModality] = useState<ModalityInterface>();

  const handleSubmit = useCallback(
    async data => {
      let genre;
      const genres = document.querySelectorAll<HTMLInputElement>(
        'input[name="genre"]',
      );
      genres.forEach(g => {
        if (g.checked) {
          genre = g.value;
        }
      });
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatóio'),
          genre: Yup.string().required('Gênero obrigatório'),
          holder: Yup.number()
            .integer('Deve ser um número')
            .required('Títulares obrigatório'),
          backup: Yup.number()
            .integer('Deve ser um número')
            .required('Reservas obrigatório'),
        });
        await schema.validate(
          {
            name: data.name,
            genre,
            holder: data.holder,
            backup: data.backup,
          },
          {
            abortEarly: false,
          },
        );
        const res = await api.post(
          '/modality',
          {
            name: data.name,
            genre,
            holder: data.holder,
            backup: data.backup,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
            },
          },
        );
        addToast({
          title: 'Modalidade cadastrada com sucesso!',
          type: 'success',
        });
        resetShowForm();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: err.response.data.status,
          title: 'Error',
          description: err.response.data.message,
        });
      }
    },
    [addToast, resetShowForm],
  );

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>{modality?.name ? modality.name : 'Cadastrar Modalidade'}</h1>
          <button type="button" onClick={resetShowForm}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="form">
          <Form ref={formRef} onSubmit={handleSubmit} initialData={modality}>
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              icon={FaUserAlt}
            ></Input>
            <Input
              name="genre"
              type="radio"
              placeholder="Masculino"
              value="masculino"
              id="masculino"
              icon={IoIosMan}
            >
              <label htmlFor="masculino">Masculino</label>
            </Input>
            <Input
              name="genre"
              type="radio"
              placeholder="Feminino"
              value="feminino"
              id="feminino"
              icon={IoIosWoman}
            >
              <label htmlFor="feminino">Feminino</label>
            </Input>
            <Input
              name="genre"
              type="radio"
              placeholder="Misto"
              value="misto"
              id="misto"
              icon={ImManWoman}
            >
              <label htmlFor="misto">Misto</label>
            </Input>
            <Input
              name="holder"
              type="number"
              placeholder="Títulares"
              icon={FaUserCheck}
            ></Input>
            <Input
              name="backup"
              type="number"
              placeholder="Reservas"
              icon={GiBackup}
            ></Input>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default ModalityForm;
