import { createContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({});

  const showModal = (component, active) => {
    setModal({ state: true, component, active });
  };
  const hideModal = () => {
    setModal({ ...modal, state: false });
  };
  const changeActive = (active) => {
    setModal({ ...modal, active });
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

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal, changeActive, optimizeHideModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
