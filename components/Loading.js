import { useContext } from 'react';
import { useTransition, animated } from 'react-spring';

import UserContext from '../context/UserContext';

import styles from '../styles/Loading.module.css';

export default function Loading() {
  const { loading } = useContext(UserContext);

  const loadingTransition = useTransition(loading[0], {
    from: { opacity: loading[1] === 1 ? 1 : 0 },
    enter: { opacity: loading[1] },
    leave: { opacity: 0 },
    config: {
      duration: 200,
    },
  });

  return loadingTransition(
    (transition, item) =>
      item && (
        <animated.div className={styles.loadingOverlay} style={transition}>
          <img src="/icons/loading.svg" alt="loading..." className={styles.loading} />
        </animated.div>
      )
  );
}
