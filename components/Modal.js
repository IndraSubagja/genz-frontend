import { useContext } from 'react';

import Login from './Modal/Login';
import Register from './Modal/Register';

import ModalContext from '../context/ModalContext';

import styles from '../styles/Modal.module.css';

export default function Modal() {
  const { modal, active, optimizeHideModal } = useContext(ModalContext);

  return (
    <>
      <style jsx>
        {`
          .${styles.modalsContainer} > li {
            transform: translateX(${active * -100}%);
          }
        `}
      </style>

      <div
        className={modal ? `${styles.modalOverlay} ${styles.visible}` : styles.modalOverlay}
        onMouseDown={optimizeHideModal}
      >
        <div className={styles.modals}>
          <ul className={styles.modalsContainer}>
            <li>
              <Login />
            </li>
            <li>
              <Register />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
