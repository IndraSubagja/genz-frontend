import { useContext } from 'react';
import GeneralContext from '../../context/GeneralContext';

import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/ConfirmEmail.module.css';

export default function ConfirmEmail({ email }) {
  const {
    modal: { hideModal },
    asyncWaiter,
    showError,
  } = useContext(GeneralContext);
  const { sendEmailConfirmation } = useContext(UserContext);

  const sendHandler = () =>
    asyncWaiter(
      async () => await sendEmailConfirmation(email),
      true,
      'Email sent',
      (error) => {
        showError(error);
        hideModal();
      }
    );

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <p className={styles.confirmEmail}>
        We&apos;ve sent an email confirmation to your email address. Please check your email inbox.{' '}
        <button type="button" onClick={sendHandler}>
          Resend email confirmation
        </button>
      </p>

      <p>
        <strong>Note:</strong> If you don&apos;t confirm your account within 24 hours, your account will deleted
        automatically.
      </p>
    </div>
  );
}
