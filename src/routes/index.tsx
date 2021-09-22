import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Routes';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import FirstLogin from '../pages/FirstLogin';
import DefaultADM from '../pages/DefaultADM';
import CertifiedPage from '../pages/CertifiedPage';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/admin" component={DefaultADM} />
      <Route path="/certificado" component={CertifiedPage} />
      <Route path="/firstlogin" component={FirstLogin} isPrivate />
      <Route path="/dashboard" component={Dashboard} isPrivate />
    </Switch>
  );
};

export default Routes;
