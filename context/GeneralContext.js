import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useState } from 'react';

import { UserProvider } from './UserContext';

const GeneralContext = createContext();

export function GeneralProvider({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState({
    state: true,
    opacity: 1,
  });
  const [notification, setNotification] = useState({});
  const [modal, setModal] = useState({});
  const [aside, setAside] = useState({});

  const showLoading = useCallback((opacity) => {
    setLoading({
      state: true,
      opacity,
    });
  }, []);
  const hideLoading = useCallback(() => {
    setLoading((loading) => ({
      state: false,
      opacity: loading.opacity,
    }));
  }, []);

  const showNotification = useCallback((status, message) => {
    setNotification({
      state: true,
      status,
      message,
    });
  }, []);
  const hideNotification = useCallback(() => {
    setNotification((notification) => ({
      state: false,
      status: notification.status,
      message: notification.message,
    }));
  }, []);

  const showModal = useCallback((component, strict = false) => {
    setModal({ state: true, component, active: 0, strict });
  }, []);
  const hideModal = useCallback(() => {
    setModal((modal) => ({ state: false, component: modal.component, active: modal.active }));
  }, []);
  const changeModal = (active) => {
    setModal({ state: modal.state, component: modal.component, active });
  };
  const optimizeHideModal = (event) => {
    if (event.button === 0) {
      const target = event.target;

      const activate = (event) => {
        if (target === event.target) {
          hideModal();
        }
      };

      target.addEventListener('mouseup', activate, { once: true });
    }
  };

  const showAside = (active) => {
    setAside({ state: true, active });
  };
  const hideAside = useCallback(async (callback) => {
    if (callback) {
      await callback();
    }
    setAside((aside) => ({ state: false, active: aside.active }));
  }, []);
  const changeAside = (active) => {
    setAside({ state: aside.state, active });
  };
  const optimizeHideAside = (event, callback) => {
    if (event.button === 0) {
      const target = event.target;

      const activate = async (event) => {
        if (target === event.target) {
          hideAside(callback);
        }
      };

      target.addEventListener('mouseup', activate, { once: true });
    }
  };

  const showError = useCallback(
    (error, controlLoading = true) => {
      const message =
        typeof error === 'string'
          ? error
          : error.response && error.response.data.message && error.response.data.message[0]?.messages
          ? error.response.data.message[0].messages[0].message
          : error.response && error.response.data.message
          ? error.response.data.message
          : error.response;

      if (typeof message !== 'string') {
        showNotification(false, 'An error occured. Please try again later');
      } else {
        showNotification(false, message);
      }

      if (controlLoading) hideLoading();
    },
    [showNotification, hideLoading]
  );

  const asyncWaiter = useCallback(
    async (callback, useDefault = false, notification, errorHandler) => {
      showLoading(0.8);
      hideNotification();

      try {
        await callback();

        if (useDefault) {
          showNotification(true, notification);
          hideLoading();
        }
      } catch (error) {
        if (errorHandler) {
          errorHandler(error);
        } else {
          showError(error);
        }
      }
    },
    [showLoading, hideLoading, showNotification, hideNotification, showError]
  );

  useEffect(() => {
    if (notification.state) {
      const notificationTime = setTimeout(() => {
        hideNotification();
      }, 2000);

      return () => clearTimeout(notificationTime);
    }
  }, [hideNotification, notification]);

  useEffect(() => {
    const routeStart = () => {
      if (!router.asPath.includes('?') || router.asPath.includes('/search') || router.asPath.includes('/checkout')) {
        if (!loading.state) {
          showLoading(0.8);
        }
        hideModal();
      }
    };
    const routeEnd = () => {
      hideLoading();
    };

    router.events.on('routeChangeStart', routeStart);
    router.events.on('routeChangeComplete', routeEnd);

    return () => {
      router.events.off('routeChangeStart', routeStart);
      router.events.off('routeChangeComplete', routeEnd);
    };
  }, [loading, showLoading, hideLoading, hideAside, hideModal, showModal, router]);

  return (
    <GeneralContext.Provider
      value={{
        loading: {
          loading,
          showLoading,
          hideLoading,
        },
        notification: {
          notification,
          showNotification,
          hideNotification,
        },
        modal: {
          modal,
          showModal,
          hideModal,
          changeModal,
          optimizeHideModal,
        },
        aside: {
          aside,
          showAside,
          hideAside,
          changeAside,
          optimizeHideAside,
        },
        showError,
        asyncWaiter,
      }}
    >
      <UserProvider>{children}</UserProvider>
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
