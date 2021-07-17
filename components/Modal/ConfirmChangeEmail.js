import { useContext } from 'react';
import GeneralContext from '../../context/GeneralContext';

import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/ConfirmEmail.module.css';

export default function ConfirmChangeEmail({ email, request }) {
  const {
    modal: { hideModal },
    asyncWaiter,
    showError,
  } = useContext(GeneralContext);
  const { sendEmailChangeConfirmation } = useContext(UserContext);

  const sendHandler = () =>
    asyncWaiter(
      async () => await sendEmailChangeConfirmation(email, request),
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
        We&apos;ve sent an email confirmation to your new email address. Please check your email inbox.{' '}
        <button type="button" onClick={sendHandler}>
          Resend email confirmation
        </button>
      </p>
    </div>
  );
}
