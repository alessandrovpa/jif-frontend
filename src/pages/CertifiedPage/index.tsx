import React, { useCallback, useRef, useContext } from 'react';
import * as Yup from 'yup';
import { FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Container, Content } from './styles';
import api from '../../services/api';

import { ToastContext } from '../../context/ToastContext';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  email: string;
}

const CertifiedPage: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Formato inválido'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        const res = await api.get(`certified?email=${data.email}`);
        console.log(res.data.url);
        window.open(res.data.url, '_blank');
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
    [addToast],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Emita seu Certificado!</h1>
          <Input icon={FiUser} name="email" type="text" placeholder="Email" />
          <Button type="submit">Enviar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default CertifiedPage;
