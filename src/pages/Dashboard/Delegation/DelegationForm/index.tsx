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
import { GoTextSize } from 'react-icons/go';
import getValidationErrors from '../../../../utils/getValidationErrors';

import { Container, Content } from './styles';

interface ComponentProps {
  id?: string;
  resetShowForm(): void;
}

interface DelegationInterface {
  name: string;
  email: string;
  abreviation: string;
}

const DelegationForm: React.FC<ComponentProps> = ({ id, resetShowForm }) => {
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const [delegation, setDelegation] = useState<DelegationInterface>();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatóio'),
          abreviation: Yup.string().required('Abreviação obrigatória'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        const res = await api.post(
          '/delegation',
          {
            name: data.name,
            abreviation: data.abreviation,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
            },
          },
        );
        addToast({
          title: 'Delegação cadastrada com sucesso!',
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
          <h1>{delegation?.name ? delegation.name : 'Cadastrar Delegação'}</h1>
          <button type="button" onClick={resetShowForm}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="form">
          <Form ref={formRef} onSubmit={handleSubmit} initialData={delegation}>
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              icon={FaUserAlt}
            ></Input>
            <Input
              name="abreviation"
              type="text"
              placeholder="Abreviação"
              icon={GoTextSize}
            ></Input>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default DelegationForm;
