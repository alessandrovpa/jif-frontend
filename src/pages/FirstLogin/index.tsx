import React, {
  useCallback,
  useRef,
  useContext,
  useState,
  ChangeEvent,
} from 'react';
import * as Yup from 'yup';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory } from 'react-router-dom';
import { Container, Content } from './styles';
import { RiProfileFill } from 'react-icons/ri';

import api from '../../services/api';

import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  email: string;
  password: string;
}

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const FILE_SIZE = 2097152;

const FirstLogin: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const [formData] = useState<FormData>(new FormData());

  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const portariaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        formData.delete('portaria');
        formData.append('portaria', e.target.files[0]);
      }
    },
    [formData],
  );
  const documentChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        formData.delete('document');
        formData.append('document', e.target.files[0]);
      }
    },
    [formData],
  );
  const documentBackChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        formData.delete('document_back');
        formData.append('document_back', e.target.files[0]);
      }
    },
    [formData],
  );

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          old_password: Yup.string().required('Senha obrigatória'),
          new_password: Yup.string().required('Senha obrigatória'),
          confirm_password: Yup.string().required('Senha obrigatória'),
          portaria: Yup.mixed()
            .required('Portaria obrigatória')
            .test(
              'fileSize',
              'Arquivo muito grande',
              value => value && value.size <= FILE_SIZE,
            )
            .test(
              'fileFormat',
              'Formato inválido',
              value => value && SUPPORTED_FORMATS.includes(value.type),
            ),
          document: Yup.mixed()
            .required('Documento obrigatório')
            .test(
              'fileSize',
              'Arquivo muito grande',
              value => value && value.size <= FILE_SIZE,
            )
            .test(
              'fileFormat',
              'Formato inválido',
              value => value && SUPPORTED_FORMATS.includes(value.type),
            ),
          document_back: Yup.mixed()
            .required('Documento obrigatório')
            .test(
              'fileSize',
              'Arquivo muito grande',
              value => value && value.size <= FILE_SIZE,
            )
            .test(
              'fileFormat',
              'Formato inválido',
              value => value && SUPPORTED_FORMATS.includes(value.type),
            ),
        });
        await schema.validate(
          {
            old_password: data.old_password,
            new_password: data.new_password,
            confirm_password: data.confirm_password,
            portaria: formData.get('portaria'),
            document: formData.get('document'),
            document_back: formData.get('document_back'),
          },
          {
            abortEarly: false,
          },
        );
        formData.append('old_password', data.old_password);
        formData.append('new_password', data.new_password);
        formData.append('confirm_password', data.confirm_password);
        await api.post('/user/firstlogin', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        });
        addToast({
          title: 'Dados atualizados!',
          type: 'success',
        });
        history.push('/dashboard');
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
    [addToast, history, formData],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Olá {user.name.toUpperCase()}, este é o seu primeiro acesso!</h1>
          <h2>Atualize suas informações para prosseguir</h2>
          <Input
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Confirme sua senha"
          />
          <Input
            icon={FiLock}
            name="new_password"
            type="password"
            placeholder="Digite uma nova senha"
          />
          <Input
            icon={FiLock}
            name="confirm_password"
            type="password"
            placeholder="Confirme sua nova senha"
          />
          <h2>Formatos aceitos: jpg, jpeg, png e pdf</h2>
          <Input
            name="portaria"
            type="file"
            id="portaria"
            placeholder="Envie sua portaria"
            icon={RiProfileFill}
            label="Envie sua portaria"
            onChange={portariaChange}
          ></Input>
          <Input
            name="document"
            type="file"
            id="document"
            placeholder="Envie a foto da frente do seu documento"
            icon={RiProfileFill}
            label="Envie a foto da frente do seu documento"
            onChange={documentChange}
          ></Input>
          <Input
            name="document_back"
            type="file"
            id="document_back"
            placeholder="Envie a foto do verso do seu documento"
            icon={RiProfileFill}
            label="Envie a foto do verso do seu documento"
            onChange={documentBackChange}
          ></Input>
          <Button type="submit">Enviar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default FirstLogin;
