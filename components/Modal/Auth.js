import { useContext } from 'react';

import Login from './Authentication/Login';
import Register from './Authentication/Register';

import ModalContext from '../../context/ModalContext';

import styles from '../../styles/Modal/Auth.module.css';

export default function Auth() {
  const {
    modal: { active },
  } = useContext(ModalContext);

  return (
    <>
      <style jsx>
        {`
          .${styles.authContainer} > li {
            transform: translateX(${active * -100}%);
          }
        `}
      </style>

      <ul className={styles.authContainer}>
        <li>
          <Login />
        </li>
        <li>
          <Register />
        </li>
      </ul>
    </>
  );
}
