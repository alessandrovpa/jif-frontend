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
import { FaUserAlt } from 'react-icons/fa';
import getValidationErrors from '../../../../utils/getValidationErrors';

import { Container, Content } from './styles';

interface ComponentProps {
  id?: string;
  resetShowForm(): void;
}

interface FunctionInterface {
  name: string;
  access: string;
}

const FunctionForm: React.FC<ComponentProps> = ({ id, resetShowForm }) => {
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const [userFunction, setUserFunction] = useState<FunctionInterface>();

  const handleSubmit = useCallback(
    async data => {
      let access;
      const niveis = document.querySelectorAll<HTMLInputElement>(
        'input[name="access"]',
      );
      niveis.forEach(input => {
        if (input.checked) {
          access = input.value;
        }
      });
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatóio'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post(
          '/function',
          {
            name: data.name,
            access,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
            },
          },
        );
        addToast({
          title: 'Funcção cadastrada com sucesso!',
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
          <h1>{userFunction?.name ? userFunction.name : 'Cadastrar Função'}</h1>
          <button type="button" onClick={resetShowForm}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="form">
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={userFunction}
          >
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              icon={FaUserAlt}
            ></Input>
            <Input name="access" type="radio" id="adm" value="0">
              <label htmlFor="adm">Administrador</label>
            </Input>
            <Input name="access" type="radio" id="secretaria" value="1">
              <label htmlFor="secretaria">Secretaria</label>
            </Input>
            <Input name="access" type="radio" id="chefe" value="2">
              <label htmlFor="chefe">Chefe de Delegação</label>
            </Input>
            <Input name="access" type="radio" id="tecnico" value="3">
              <label htmlFor="tecnico">Tecnico de modalidade</label>
            </Input>
            <Input name="access" type="radio" id="servidor" value="4">
              <label htmlFor="servidor">Servidor</label>
            </Input>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default FunctionForm;
