import { createContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(false);
  const [active, setActive] = useState(0);

  const showModal = (active) => {
    setActive(active);
    setModal(true);
  };

  const hideModal = () => {
    setModal(false);
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
    <ModalContext.Provider value={{ modal, active, setActive, showModal, hideModal, optimizeHideModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
