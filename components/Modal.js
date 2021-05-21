import { useContext } from 'react';
import { useTransition, animated } from 'react-spring';

import ModalContext from '../context/ModalContext';

import styles from '../styles/Modal.module.css';

export default function Modal() {
  const {
    modal: { state, component },
    optimizeHideModal,
  } = useContext(ModalContext);

  const overlayTransition = useTransition(state, {
    from: {
      backgroundColor: 'transparent',
    },
    enter: {
      backgroundColor: 'hsla(0, 0%, 100%, 0.4)',
    },
    leave: {
      backgroundColor: 'transparent',
    },
    config: {
      duration: 200,
    },
  });

  const modalTransition = useTransition(state, {
    from: {
      transform: 'translateY(-100%)',
    },
    enter: {
      transform: 'translateY(0%)',
    },
    leave: {
      transform: 'translateY(-100%)',
    },
    config: {
      duration: 200,
    },
  });

  return overlayTransition(
    (transition, item) =>
      item && (
        <animated.div className={styles.modalOverlay} style={transition} onMouseDown={optimizeHideModal}>
          {modalTransition(
            (transition, item) =>
              item && (
                <animated.div className={styles.modal} style={transition}>
                  {component}
                </animated.div>
              )
          )}
        </animated.div>
      )
  );
}
