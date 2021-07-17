import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useSpring } from 'react-spring';
import { FaBars } from 'react-icons/fa';
import { ToastContext } from '../../context/ToastContext';

import api from '../../services/api';
import { MenuData } from './MenuData';

import { Container, Anchor, Ul } from './styles';

interface MenuProps {
  changeLocation(page: string): void;
}

const Menu: React.FC<MenuProps> = ({ changeLocation }) => {
  const [menu, setMenu] = useState(true);
  const [actualPage, setActualPage] = useState('/dashboard');
  const [permission, setPermission] = useState<Permissions>({} as Permissions);
  const { addToast } = useContext(ToastContext);

  const props = useSpring({
    opacity: menu ? 1 : 0,
    width: menu ? 200 : 0,
    transition: 'opacity 0.2s',
  });

  const veirifyPermission = useCallback(
    required => {
      return permission <= required;
    },
    [permission],
  );

  const getPermission = useCallback(async () => {
    try {
      const response = await api.get('/user/access', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
        },
      });
      setPermission(response.data.access);
    } catch (err) {
      addToast({
        type: err.response.data.status,
        title: 'Error',
        description: err.response.data.message,
      });
    }
  }, [addToast]);

  const handleChangePage = useCallback(
    async path => {
      changeLocation(path);
      setActualPage(path);
    },
    [changeLocation],
  );

  useEffect(() => {
    getPermission();
  }, [getPermission]);

  return (
    <Container>
      <FaBars size={20} onClick={() => setMenu(!menu)} />

      {menu && (
        <Ul style={props}>
          <Anchor
            to={MenuData[0].path}
            key={MenuData[0].path}
            onClick={() => handleChangePage(MenuData[0].path)}
            isActived={actualPage === MenuData[0].path}
          >
            {MenuData[0].icon}
            <li>{MenuData[0].title}</li>
          </Anchor>
          {MenuData.map(
            data =>
              data.required &&
              veirifyPermission(data.required) && (
                <Anchor
                  to={data.path}
                  key={data.path}
                  onClick={() => handleChangePage(data.path)}
                  isActived={actualPage === data.path}
                >
                  {data.icon}
                  <li>{data.title}</li>
                </Anchor>
              ),
          )}
        </Ul>
      )}
    </Container>
  );
};

export default Menu;
