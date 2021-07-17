import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { Container, Nav, Content, Page } from './styles';

import Header from '../../components/Header';
import Menu from '../../components/Menu';

import Athlete from './Athlete';
import User from './User';
import Delegation from './Delegation';
import Modality from './Modality';
import UserFunction from './Function';
import Home from './Home';

const pages = {
  home: <Home />,
  athlete: <Athlete />,
  delegation: <Delegation />,
  user: <User />,
  modality: <Modality />,
  function: <UserFunction />,
};

const Dashboard: React.FC = () => {
  const [location, setLocation] = useState(useLocation().pathname);
  const [ActualPage, setActualPage] = useState(pages.home);

  const changePage = useCallback(
    (page: string) => {
      setLocation(page);
      switch (location) {
        case '/dashboard':
          setActualPage(pages.home);
          break;
        case '/dashboard/athlete':
          setActualPage(pages.athlete);
          break;
        case '/dashboard/delegation':
          setActualPage(pages.delegation);
          break;
        case '/dashboard/modality':
          setActualPage(pages.modality);
          break;
        case '/dashboard/user':
          setActualPage(pages.user);
          break;
        case '/dashboard/function':
          setActualPage(pages.function);
          break;
        default:
          setActualPage(pages.home);
          break;
      }
    },
    [location],
  );

  useEffect(() => {
    switch (location) {
      case '/dashboard':
        setActualPage(pages.home);
        break;
      case '/dashboard/athlete':
        setActualPage(pages.athlete);
        break;
      case '/dashboard/delegation':
        setActualPage(pages.delegation);
        break;
      case '/dashboard/modality':
        setActualPage(pages.modality);
        break;
      case '/dashboard/user':
        setActualPage(pages.user);
        break;
      case '/dashboard/function':
        setActualPage(pages.function);
        break;
      default:
        setActualPage(pages.home);
        break;
    }
  }, [location]);

  return (
    <Container>
      <Header />
      <Content>
        <Nav>
          <Menu changeLocation={changePage} />
        </Nav>
        <Page>{ActualPage}</Page>
      </Content>
    </Container>
  );
};

export default Dashboard;
