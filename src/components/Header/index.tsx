import React, { useContext } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { RiLogoutBoxRFill } from 'react-icons/ri';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

import { Container } from './styles';

const Header: React.FC = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const { signOut } = useContext(AuthContext);

  return (
    <Container>
      <div>
        <h1 id="logo">EJIF Games</h1>
      </div>
      <div>
        <VscColorMode
          title="Mudar tema"
          onClick={() => toggleTheme()}
          size={25}
        />
        <button type="button" onClick={() => signOut()}>
          Sair
          <RiLogoutBoxRFill size={30} />
        </button>
      </div>
    </Container>
  );
};

export default Header;
