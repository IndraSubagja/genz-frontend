import { useContext } from 'react';
import { useTransition, animated } from 'react-spring';

import GeneralContext from '../context/GeneralContext';

import styles from '../styles/Loading.module.css';

export default function Loading() {
  const {
    loading: {
      loading: { state, opacity },
    },
  } = useContext(GeneralContext);

  const loadingTransition = useTransition(state, {
    from: { opacity: opacity === 1 ? 1 : 0 },
    enter: { opacity: opacity },
    leave: { opacity: 0, delay: 200 },
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
