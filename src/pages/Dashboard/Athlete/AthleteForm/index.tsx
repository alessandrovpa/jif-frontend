/* eslint-disable import/no-duplicates */
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
  ChangeEvent,
} from 'react';
import * as Yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../../../services/api';
import { ToastContext } from '../../../../context/ToastContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillMail, AiFillFileText, AiFillPhone } from 'react-icons/ai';
import { IoLogoGameControllerA, IoIosMan, IoIosWoman } from 'react-icons/io';
import { RiProfileFill, RiCalendarFill } from 'react-icons/ri';
import getValidationErrors from '../../../../utils/getValidationErrors';

import { Container, Content } from './styles';

interface ComponentProps {
  id?: string;
  resetShowForm(): void;
}

interface AthleteInterface {
  name: string;
  email: string;
  birth: string;
  identity: string;
  contact: string;
  nickname: string;
  game_id: string;
  observation?: string;
  image_url: string;
  status: number;
  modalities: [
    {
      id: string;
      name: string;
    },
  ];
  delegation: {
    name: string;
  };
  picture_url: string;
  document_url: string;
  document_back_url: string;
  authorization_url?: string;
}

interface ModalityInterface {
  id: string;
  name: string;
  holder: number;
  backup: number;
}

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const FILE_SIZE = 2097152;

const ShowAthlete: React.FC<ComponentProps> = ({ id, resetShowForm }) => {
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const [athlete, setAthlete] = useState<AthleteInterface>();
  const [modalities, setModalities] = useState<ModalityInterface[]>();
  const [formData] = useState<FormData>(new FormData());

  const pictureChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        formData.delete('picture');
        formData.append('picture', e.target.files[0]);
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
  const authorizationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        formData.delete('authorization');
        formData.append('authorization', e.target.files[0]);
      }
    },
    [formData],
  );

  const search = useCallback(() => {
    api
      .get(`/athlete?athlete_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setAthlete(data.data));
  }, [id]);

  const handleSubmit = useCallback(
    async data => {
      const modalities: String[] = [];
      const checkboxes = document.querySelectorAll<HTMLInputElement>(
        'input[name="modalities[]"]',
      );
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          modalities.push(checkbox.value);
        }
      });
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
        console.log(data);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatóio'),
          email: Yup.string()
            .required('Email obrigatóio')
            .email('Formato inválido'),
          birth: Yup.date().required('Data de nascimento obrigatóia'),
          identity: Yup.string().required('Identidade obrigatóia'),
          genre: Yup.string().required('Sexo obrigatóio'),
          contact: Yup.string()
            .required('Telefone obrigatóio')
            .min(10, 'Mínimo 10 caracteres')
            .max(15, 'Máximo 15 caracteres'),
          nickname: Yup.string().required('Nickname obrigatóio'),
          game_id: Yup.string().required('ID Obrigatória'),
          picture: Yup.mixed()
            .required('Foto 3x4 obrigatória')
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
          authorization: Yup.mixed()
            .optional()
            .test(
              'fileSize',
              'Arquivo muito grande',
              value => (value && value.size <= FILE_SIZE) || !value,
            )
            .test(
              'fileFormat',
              'Formato inválido',
              value =>
                (value && SUPPORTED_FORMATS.includes(value.type)) || !value,
            ),
        });
        await schema.validate(
          {
            name: data.name,
            email: data.email,
            birth: data.birth,
            identity: data.identity,
            genre,
            contact: data.contact,
            nickname: data.nickname,
            game_id: data.game_id,
            picture: formData.get('picture'),
            document: formData.get('document'),
            document_back: formData.get('document_back'),
            authorization: formData.get('authorization'),
          },
          {
            abortEarly: false,
          },
        );
        let res;
        if (!id) {
          res = await api.post(
            '/athlete',
            {
              name: data.name,
              email: data.email,
              birth: data.birth,
              identity: data.identity,
              genre,
              contact: data.contact,
              nickname: data.nickname,
              game_id: data.game_id,
              modalities,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
              },
            },
          );
        } else {
          res = await api.post(
            `/athlete/${id}/update`,
            {
              name: data.name,
              email: data.email,
              birth: data.birth,
              identity: data.identity,
              genre,
              contact: data.contact,
              nickname: data.nickname,
              game_id: data.game_id,
              modalities,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
              },
            },
          );
        }

        formData.append('athlete_id', res.data.id);
        await api.post('/athlete/files', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        });
        addToast({
          title: 'Atleta cadastrado com sucesso!',
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
    [addToast, formData, resetShowForm],
  );

  useEffect(() => {
    if (id) {
      search();
    }
  }, [search, id]);

  const searchModality = useCallback((localGenre: 'masculino' | 'feminino') => {
    api
      .get(`/modality?genre=${localGenre}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setModalities(data.data));
  }, []);

  return (
    <Container>
      <Content>
        <div id="title">
          <h1>{athlete?.name ? athlete.name : 'Cadastrar Atleta'}</h1>
          <button type="button" onClick={resetShowForm}>
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <div id="form">
          <Form ref={formRef} onSubmit={handleSubmit} initialData={athlete}>
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              icon={FaUserAlt}
            ></Input>
            <Input
              onClick={() => searchModality('masculino')}
              name="genre"
              id="masculino"
              type="radio"
              value="masculino"
              icon={IoIosMan}
            >
              <label htmlFor="masculino">Masculino</label>
            </Input>
            <Input
              onClick={() => searchModality('feminino')}
              name="genre"
              id="feminino"
              type="radio"
              value="feminino"
              icon={IoIosWoman}
            >
              <label htmlFor="feminino">Feminino</label>
            </Input>
            <Input
              name="email"
              type="text"
              placeholder="Email"
              icon={AiFillMail}
            ></Input>
            <Input
              name="birth"
              type="date"
              placeholder="Data de nascimento"
              icon={RiCalendarFill}
            ></Input>
            <Input
              name="identity"
              type="text"
              placeholder="Número de identidade"
              icon={AiFillFileText}
            ></Input>
            <Input
              name="contact"
              type="text"
              placeholder="Número para contato (apenas números)"
              icon={AiFillPhone}
            ></Input>
            <Input
              name="nickname"
              type="text"
              placeholder="Nickname ou nome de invocador"
              icon={IoLogoGameControllerA}
            ></Input>
            <Input
              name="game_id"
              type="text"
              placeholder="ID(Free Fire/LOL) ou nome de usuário(a) no aplicativo Zoom"
              icon={IoLogoGameControllerA}
            ></Input>
            <h1>Documentos</h1>
            <h4>Apenas jpg, jpeg, e png de até no máximo 2 MB</h4>
            <Input
              name="picture"
              type="file"
              id="picture"
              placeholder="Foto 3x4"
              icon={RiProfileFill}
              label="Foto 3x4"
              onChange={pictureChange}
            ></Input>
            <Input
              name="document"
              type="file"
              id="document"
              placeholder="Foto da identidade(frente)"
              icon={AiFillFileText}
              label="Foto do documento pessoal(frente)"
              onChange={documentChange}
            ></Input>
            <Input
              name="document_back"
              type="file"
              id="document_back"
              placeholder="Foto da identidade(verso)"
              icon={AiFillFileText}
              label="Foto do documento pessoal(verso)"
              onChange={documentBackChange}
            ></Input>
            <Input
              name="authorization"
              type="file"
              id="authorization"
              placeholder="Foto da autorização dos pais"
              icon={AiFillFileText}
              label="Foto da autorização dos pais (para menores de 18 anos)"
              onChange={authorizationChange}
            ></Input>

            {modalities && <h1>Modalidades</h1>}
            {modalities &&
              modalities.map(modality => (
                <Input
                  key={modality.id}
                  name="modalities[]"
                  type="checkbox"
                  value={modality.id}
                  id={modality.id}
                >
                  <label
                    htmlFor={modality.id}
                  >{`${modality.name} (${modality.holder} titulares e ${modality.backup} reservas)`}</label>
                </Input>
              ))}

            <Button type="submit">Enviar</Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default ShowAthlete;
