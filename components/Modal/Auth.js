import { useContext, useState } from 'react';

import Login from './Authentication/Login';
import Register from './Authentication/Register';

import GeneralContext from '../../context/GeneralContext';

import styles from '../../styles/Modal/Auth.module.css';
import ForgotPassword from './Authentication/ForgotPassword';

export default function Auth({ query }) {
  const [forgot, setForgot] = useState(false);

  const {
    modal: {
      modal: { active },
    },
  } = useContext(GeneralContext);

  return (
    <>
      <style jsx>
        {`
          .${styles.authContainer} > li {
            transform: translateX(${active * -100}%);
          }
          .${styles.authContainer} > li:nth-child(-n + ${active}),
          .${styles.authContainer} > li:nth-last-child(-n + ${1 - active}) {
            visibility: hidden;
          }
        `}
      </style>

      <ul className={styles.authContainer}>
        <li>{!forgot ? <Login setForgot={setForgot} query={query} /> : <ForgotPassword setForgot={setForgot} />}</li>
        <li>
          <Register />
        </li>
      </ul>
    </>
  );
}
