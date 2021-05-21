import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import { AsideProvider } from './AsideContext';
import { ModalProvider } from './ModalContext';
import { API_URL } from '../utils/urls';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState([true, 1]);
  const [notification, setNotification] = useState({});

  const showLoading = (opacity) => {
    setLoading([true, opacity]);
  };
  const hideLoading = () => {
    setTimeout(() => {
      setLoading([false]);
    }, 200);
  };

  const showNotification = (status, message) => {
    if (!notification.state) {
      setNotification({
        state: true,
        status,
        message,
      });
    } else {
      hideNotification(notification.status, notification.message);

      setTimeout(() => {
        setNotification({
          state: true,
          status,
          message,
        });
      }, 200);
    }
  };
  const hideNotification = (status, message) => {
    setNotification({
      state: false,
      status,
      message,
    });
  };

  const updateUserCart = (updatedCart) => {
    setUser({ ...user, cart: [...updatedCart] });
    localStorage.setItem('userInfo', JSON.stringify({ ...user, cart: [...updatedCart] }));
  };

  const userRegister = async (userData) => {
    showLoading(0.8);

    try {
      const { data } = await axios.post(`${API_URL}/auth/local/register`, userData);

      showNotification(true, `Welcome, ${data.user.username}!`);
      hideLoading();

      setUser({ token: data.jwt, ...data.user });
      localStorage.setItem('userInfo', JSON.stringify({ token: data.jwt, ...data.user }));
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message[0].messages[0].message
          : error.message;

      showNotification(false, message);
      hideLoading();
    }
  };

  const userLogin = async (userData) => {
    showLoading(0.8);

    try {
      const { data } = await axios.post(`${API_URL}/auth/local`, userData);

      showNotification(true, `Welcome back, ${data.user.username}!`);
      hideLoading();

      setUser({ token: data.jwt, ...data.user });
      localStorage.setItem('userInfo', JSON.stringify({ token: data.jwt, ...data.user }));
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message[0].messages[0].message
          : error.message;

      showNotification(false, message);
      hideLoading();
    }
  };

  const userLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  useEffect(() => {
    if ((!user && localStorage.getItem('userInfo')) || !document) {
      showLoading(1);
      setUser(JSON.parse(localStorage.getItem('userInfo')));
    } else {
      hideLoading();
    }
  }, [user]);

  useEffect(() => {
    if (notification.state) {
      const notificationTime = setTimeout(() => {
        hideNotification(notification.status, notification.message);
      }, 3000);

      return () => clearTimeout(notificationTime);
    }
  }, [notification]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        notification,
        updateUserCart,
        showLoading,
        hideLoading,
        showNotification,
        hideNotification,
        userRegister,
        userLogin,
        userLogout,
      }}
    >
      <ModalProvider>
        <AsideProvider>{children}</AsideProvider>
      </ModalProvider>
    </UserContext.Provider>
  );
}

export default UserContext;
