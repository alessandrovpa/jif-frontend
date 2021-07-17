import React, { useContext, useEffect, useCallback, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';

import { Container, Content, Table } from './styles';

interface RelatoryInterface {
  total: number;
  aprovados: number;
  reprovados: number;
}

const Home: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [relatory, setRelatory] = useState<RelatoryInterface>();

  const getRelatory = useCallback(async () => {
    api
      .get('/relatory/athletes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      })
      .then(data => setRelatory(data.data));
  }, []);

  useEffect(() => {
    getRelatory();
  }, [getRelatory]);
  return (
    <Container>
      <Content>
        <h1>Olá {user.name.toUpperCase()}</h1>
      </Content>
      <Content>
        <h2>Relatório de inscrições - {user.delegation.abreviation}</h2>
        <Table>
          <tbody>
            <tr>
              <th>Total</th>
              <td>{relatory?.total}</td>
            </tr>
            <tr>
              <th>Aprovados</th>
              <td>{relatory?.aprovados}</td>
            </tr>
            <tr>
              <th>Reprovados</th>
              <td>{relatory?.reprovados}</td>
            </tr>
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default Home;
