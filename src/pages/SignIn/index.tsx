import React, { useCallback, useRef, useContext } from 'react';
import * as Yup from 'yup';
import { FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Container, Content } from './styles';

import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Formato inválido'),
          password: Yup.string().required('Senha obrigatória'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await signIn({ email: data.email, password: data.password });
        addToast({
          title: 'Login efetuado com sucesso!',
          type: 'success',
        });
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
    [signIn, addToast],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Login</h1>
          <Input icon={FiUser} name="email" type="text" placeholder="Email" />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Senha"
          />
          <Button type="submit">Enviar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default SignIn;
