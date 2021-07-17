import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

import { Container, Content } from './styles';

const Home: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Content>
        <h1>Olá {user.name.toUpperCase()}</h1>
      </Content>
    </Container>
  );
};

export default Home;
