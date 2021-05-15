import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import { AsideProvider } from './AsideContext';
import { ModalProvider } from './ModalContext';
import { API_URL } from '../utils/urls';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const userRegister = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/local/register`, userData);
      setUser({ token: data.jwt, ...data.user });
      localStorage.setItem('userInfo', JSON.stringify({ token: data.jwt, ...data.user }));
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      setMessage(message);
    }
  };

  const userLogin = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/local`, userData);
      setUser({ token: data.jwt, ...data.user });
      localStorage.setItem('userInfo', JSON.stringify({ token: data.jwt, ...data.user }));
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      setMessage(message);
    }
  };

  const userLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userRegister, userLogin, userLogout }}>
      <ModalProvider>
        <AsideProvider>{children}</AsideProvider>
      </ModalProvider>
    </UserContext.Provider>
  );
}

export default UserContext;
