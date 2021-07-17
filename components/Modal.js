import { useContext } from 'react';
import { useTransition, animated } from 'react-spring';
import FocusTrap from 'focus-trap-react';

import GeneralContext from '../context/GeneralContext';

import styles from '../styles/Modal.module.css';

export default function Modal() {
  const {
    modal: {
      modal: { state, component, strict },
      hideModal,
      optimizeHideModal,
    },
  } = useContext(GeneralContext);

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
        <FocusTrap>
          <animated.dialog
            className={styles.modalOverlay}
            style={transition}
            onMouseDown={!strict ? optimizeHideModal : null}
            onKeyDown={(event) => (event.key === 'Escape' ? hideModal() : null)}
            open={item}
            role="dialog"
            aria-modal="true"
          >
            {modalTransition(
              (transition, item) =>
                item && (
                  <animated.div className={styles.modal} style={transition}>
                    {component}
                  </animated.div>
                )
            )}
          </animated.dialog>
        </FocusTrap>
      )
  );
}
