import { useContext } from 'react';
import { animated, useTransition } from 'react-spring';
import UserContext from '../context/UserContext';

import styles from '../styles/Notification.module.css';
import { ChecklistIcon, CrossIcon } from '../utils/icons';

export default function Notification() {
  const {
    notification: { state, status, message },
    hideNotification,
  } = useContext(UserContext);

  const notificationTransition = useTransition(state, {
    from: { transform: 'translate(-50%, -120%)' },
    enter: { transform: 'translate(-50%, 50%)' },
    leave: { transform: 'translate(-50%, -120%)' },
    config: {
      duration: 200,
    },
  });

  return notificationTransition(
    (transition, item) =>
      item && (
        <animated.div className={styles.notification} style={transition}>
          {status ? (
            <span className="inlineIcon success">
              <ChecklistIcon />
            </span>
          ) : (
            <span className="inlineIcon danger">
              <CrossIcon />
            </span>
          )}
          <span>{message}</span>
          <button type="button" onClick={() => hideNotification(status, message)}>
            <CrossIcon />
          </button>
        </animated.div>
      )
  );
}
