import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

interface EmailData {
  email: string;
}

const DefaultADM: React.FC = () => {
  const history = useHistory();

  const handlingAdm = useCallback(async () => {
    await api.get('/user/admin').then();
    history.push('/');
  }, [history]);

  useEffect(() => {
    handlingAdm();
  }, [handlingAdm]);

  return <h1>Olá</h1>;
};

export default DefaultADM;
