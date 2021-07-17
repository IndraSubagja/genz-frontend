import { useContext } from 'react';
import { animated, useTransition } from 'react-spring';

import GeneralContext from '../context/GeneralContext';

import styles from '../styles/Notification.module.css';
import { ChecklistIcon, CrossIcon } from '../utils/icons';

export default function Notification() {
  const {
    notification: { notification, hideNotification },
  } = useContext(GeneralContext);

  const notificationTransition = useTransition(notification.state, {
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
          {notification.status ? (
            <span className="inline-icon success">
              <ChecklistIcon />
            </span>
          ) : (
            <span className="inline-icon danger">
              <CrossIcon />
            </span>
          )}
          <span>{notification.message}</span>
          <button type="button" onClick={() => hideNotification()}>
            <CrossIcon />
          </button>
        </animated.div>
      )
  );
}
