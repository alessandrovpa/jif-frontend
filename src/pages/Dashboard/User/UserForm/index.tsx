/* eslint-disable import/no-duplicates */
import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from 'react';
import * as Yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../../../services/api';
import { ToastContext } from '../../../../context/ToastContext';
import { AuthContext } from '../../../../context/AuthContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillMail, AiFillPhone, AiFillFileText } from 'react-icons/ai';
import getValidationErrors from '../../../../utils/getValidationErrors';

import Select, { OptionsProps } from '../../../../components/Select';

import { Container, Content } from './styles';

interface ComponentProps {
  resetShowForm(): void;
}

interface DelegationAndFunctionInterface {
  id: string;
  name: string;
  value: string;
}

const UserForm: React.FC<ComponentProps> = ({ resetShowForm }) => {
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const formRef = useRef<FormHandles>(null);
  const [delegations, setDelegations] = useState<OptionsProps[]>([]);
  const [functions, setFunctions] = useState<OptionsProps[]>([]);

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});
        let schema;
        if (user.access <= 1) {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatóio'),
            email: Yup.string()
              .required('Email obrigatório')
              .email('Formato inválido'),
            contact: Yup.string()
              .required('Contato obrigatório')
              .min(10, 'Mínimo 10 digitos')
              .max(11, 'Máximo 11 digitos'),
            siape: Yup.string().required('SIAPE obrigatório'),
            delegation_id: Yup.string().required('Delegação obrigatória'),
            function_id: Yup.string().required('Função obrigatória'),
          });
        } else {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatóio'),
            email: Yup.string()
              .required('Email obrigatório')
              .email('Formato inválido'),
            contact: Yup.string()
              .required('Contato obrigatório')
              .min(10, 'Mínimo 10 digitos')
              .max(11, 'Máximo 11 digitos'),
            siape: Yup.string().required('SIAPE obrigatório'),
            function_id: Yup.string().required('Função obrigatória'),
          });
        }

        await schema.validate(data, {
          abortEarly: false,
        });
        const res = await api.post('/user', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        });
        addToast({
          title: 'Usuário cadastrado com sucesso!',
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
    [addToast, resetShowForm, user.access],
  );

  const searchSelectOptions = useCallback(async () => {
    try {
      const resDelegations = await api.get('/delegation', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (resDelegations.data.length > 0) {
        resDelegations.data.map(
          (delegation: DelegationAndFunctionInterface) => {
            delegation['value'] = delegation.id;
            return delegation;
          },
        );
        setDelegations(resDelegations.data);
      } else {
        setDelegations([]);
      }
      const resFunctions = await api.get('/function', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      if (resFunctions.data.length > 0) {
        resFunctions.data.map((f: DelegationAndFunctionInterface) => {
          f['value'] = f.id;
          return f;
        });
        setFunctions(resFunctions.data);
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
  }, [addToast]);

  useEffect(() => {
    searchSelectOptions();
  }, [searchSelectOptions]);

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>Cadastrar Usuário</h1>
          <button type="button" onClick={resetShowForm}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="form">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              icon={FaUserAlt}
            ></Input>
            <Input
              name="email"
              type="text"
              placeholder="Email"
              icon={AiFillMail}
            ></Input>
            <Input
              name="contact"
              type="text"
              placeholder="Contato"
              icon={AiFillPhone}
            ></Input>
            <Input
              name="siape"
              type="text"
              placeholder="SIAPE"
              icon={AiFillFileText}
            ></Input>
            {user.access <= 1 && (
              <Select name="delegation_id" options={delegations}></Select>
            )}

            <Select name="function_id" options={functions}></Select>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default UserForm;
