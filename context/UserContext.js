import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import ConfirmEmail from '../components/Modal/ConfirmEmail';
import ConfirmChangeEmail from '../components/Modal/ConfirmChangeEmail';
import Auth from '../components/Modal/Auth';

import GeneralContext from './GeneralContext';
import ResetPassword from '../components/Modal/ResetPassword';

const UserContext = createContext();

export function UserProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const {
    loading: { hideLoading },
    modal: { showModal },
    notification: { showNotification },
    showError,
  } = useContext(GeneralContext);

  const getToken = useCallback(async () => {
    const { data } = await axios.get('/auth/token');

    return data.token;
  }, []);

  const refreshToken = useCallback(async () => {
    const token = await getToken();

    if (token) {
      await axios.post(
        '/auth/refresh-token',
        { token },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    }
  }, [getToken]);

  const userLogout = useCallback(async () => {
    try {
      await axios.get('/auth/logout');
    } finally {
      setUser('public');

      localStorage.removeItem('tempOrder');
      localStorage.removeItem('orderShippingAddress');
      localStorage.removeItem('tempShippingAddress');
      sessionStorage.removeItem('orderStep');
    }
  }, []);

  const getUser = useCallback(async () => {
    const token = await getToken();

    if (token) {
      try {
        const { data } = await axios.get('/users/me', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setUser(data);
      } catch (error) {
        await userLogout().catch((error) => showError(error));
      }
    } else {
      await userLogout().catch((error) => showError(error));
    }
  }, [getToken, showError, userLogout]);

  const checkUsername = async (username) => {
    await axios.post('/check-username', { username });
  };

  const userRegister = async (userData) => {
    const { data } = await axios.post('/auth/local/register', userData);

    showModal(<ConfirmEmail email={data.user.email} />, true);
  };

  const userLogin = async (userData) => {
    const { data } = await axios.post('/auth/local', userData);

    setUser(data.user);
    localStorage.setItem('auth', 'login');

    return data.user;
  };

  const deleteUserAvatar = async (file) => {
    const token = await getToken();

    await axios.delete(`/upload/files/${file.id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  const changeUserAvatar = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'user');
    formData.append('refId', user.id);
    formData.append('source', 'users-permissions');
    formData.append('field', 'avatar');

    const token = await getToken();

    await axios.post('/upload', formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  const updateUserData = useCallback(
    async (updatedData) => {
      const token = await getToken();

      const { data } = await axios.put('/users/me', updatedData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
    },
    [getToken]
  );

  const createOrder = async (order) => {
    const token = await getToken();

    const { data } = await axios.post('/orders', order, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await getUser();

    return data;
  };

  const updateOrder = async (id, log) => {
    const token = await getToken();

    await axios.put(
      `/orders/${id}`,
      { log },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    await getUser();
  };

  const cancelOrder = async (id) => {
    const token = await getToken();

    await axios.delete(`/orders/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await getUser();
  };

  const sendEmailConfirmation = async (email) => {
    await axios.post('/auth/send-email-confirmation', { email });
  };

  const sendEmailChangeRequest = async (email, newEmail) => {
    const token = await getToken();

    await axios.post(
      '/auth/send-email-change-request',
      { email, newEmail },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const sendEmailChangeConfirmation = async (email, request) => {
    await axios.get('/auth/send-email-change-confirmation', { params: { email, request, cross: true } });
  };

  const sendPhoneNumberVerification = async (newPhoneNumber) => {
    const token = await getToken();

    await axios.post(
      '/auth/send-phone-number-verification',
      { newPhoneNumber },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const phoneNumberVerification = async (data) => {
    const token = await getToken();

    await axios.post('/auth/phone-number-verification', data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    setUser({ ...user, phoneNumber: data.phoneNumber });
  };

  const forgotPassword = async (email) => {
    await axios.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (userData) => {
    await axios.post('/auth/reset-password', userData);
  };

  useEffect(() => {
    if (user && user !== 'public') {
      refreshToken();

      const jwtCountdown = setInterval(() => {
        refreshToken();
      }, 1000 * 60 * 10 - 1000 * 10); // Refresh 10s before token expired if no reload happens

      return () => clearInterval(jwtCountdown);
    }
  }, [user, refreshToken]);

  useEffect(() => {
    const checkUser = async () => {
      await getUser();
      hideLoading();
    };

    const multiTabAuth = (event) => {
      if ((event.key === 'auth' && event.newValue) || (event.key === 'tempOrder' && router.pathname === '/checkout')) {
        router.reload();
      }
    };

    const { redirected, error } = router.query;

    localStorage.removeItem('auth');

    if (!user) {
      checkUser();
    } else {
      if (redirected) {
        localStorage.setItem('auth', 'redirection');

        if (redirected === 'reset-password') {
          showModal(<ResetPassword code={router.query.code} />, true);
        } else if (redirected === 'change-email-request') {
          showModal(<ConfirmChangeEmail email={router.query.email} request={router.query.request} />, true);
        } else if (redirected === 'order') {
          showModal(<Auth query={router.query} />);
        } else {
          showModal(<Auth />);
        }

        router.replace('/');

        if (redirected === 'confirm-email') {
          showNotification(true, 'Account activated. Please login to continue');
        } else if (redirected === 'change-email') {
          showNotification(true, 'Email changed. Please login to continue');
        } else if (redirected === 'change-email-request') {
          showNotification(true, 'Email sent');
        }
      } else if (error) {
        localStorage.setItem('auth', 'redirection');
        router.replace('/');

        if (error === 'confirm-email') {
          showNotification(false, 'An error occured when activating your account');
        } else if (error === 'change-email') {
          showNotification(false, 'An error occured when changing your email');
        }
      }
    }

    router.events.on('routeChangeComplete', getUser);
    window.addEventListener('storage', multiTabAuth);

    return () => {
      router.events.off('routeChangeComplete', getUser);
      window.removeEventListener('storage', multiTabAuth);
    };
  }, [user, showModal, showNotification, hideLoading, getUser, router]);

  return (
    <UserContext.Provider
      value={{
        user,
        getUser,
        getToken,
        checkUsername,
        userRegister,
        userLogin,
        userLogout,
        changeUserAvatar,
        deleteUserAvatar,
        updateUserData,
        createOrder,
        updateOrder,
        cancelOrder,
        sendEmailConfirmation,
        sendEmailChangeRequest,
        sendEmailChangeConfirmation,
        sendPhoneNumberVerification,
        phoneNumberVerification,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
