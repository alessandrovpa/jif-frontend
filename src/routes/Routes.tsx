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
        console.log(location);
        return isPrivate === !!token ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? `/` : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Routes;
