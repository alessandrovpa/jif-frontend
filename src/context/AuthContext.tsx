import React, { createContext, useCallback, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    siape: string;
    access: number;
    created_at: Date;
    updated_at: Date;
    function: string;
    delegation: {
      name: string;
      abreviation: string;
    };
    portaria_url: string;
    document_url: string;
    document_back_url: string;
  };
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextInterface {
  user: {
    id: string;
    name: string;
    email: string;
    siape: string;
    access: number;
    created_at: Date;
    updated_at: Date;
    function: string;
    delegation: {
      name: string;
      abreviation: string;
    };
    portaria_url: string;
    document_url: string;
    document_back_url: string;
  };
  token: string;
  signIn(data: SignInCredentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@JIF:token');
    const user = localStorage.getItem('@JIF:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const res = await api.post('session', {
      email,
      password,
    });
    const { token, user } = res.data;

    localStorage.setItem('@JIF:token', token);
    localStorage.setItem('@JIF:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@JIF:token');
    localStorage.removeItem('@JIF:user');

    setData({} as AuthState);
  }, []);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('@JIF:token');
    if (token) {
      try {
        await api.get('/user/access', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@JIF:token')}`,
          },
        });
      } catch (err) {
        signOut();
      }
    }
  }, [signOut]);

  useEffect(() => {
    verifyToken();
    setInterval(async () => {
      await verifyToken();
    }, 300000);
  }, [verifyToken]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, token: data.token, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
