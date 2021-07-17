import React, { useContext } from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Routes: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { token, user } = useContext(AuthContext);
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        let finalpath;
        let firstLogin = false;
        if (user) {
          firstLogin = user.created_at === user.updated_at;
          if (firstLogin) {
            finalpath = '/firstlogin';
          } else {
            finalpath = '/dashboard';
          }
        }
        console.log(finalpath);
        return isPrivate === !!token ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : finalpath,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Routes;
