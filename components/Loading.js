import { useContext } from 'react';

import UserContext from '../context/UserContext';

import styles from '../styles/Loading.module.css';

export default function Loading() {
  const { loading } = useContext(UserContext);
  const backgroundColor = loading[1] === 'full' ? 'hsla(0, 0%, 100%)' : 'hsla(0, 0%, 100%, 0.8)';

  return (
    <>
      <style jsx>
        {`
          .${styles.visible} {
            background-color: ${backgroundColor};
          }
        `}
      </style>

      <div className={loading[0] ? `${styles.loadingOverlay} ${styles.visible}` : styles.loadingOverlay}>
        <img src="/icons/loading.svg" alt="loading..." />
      </div>
    </>
  );
}
