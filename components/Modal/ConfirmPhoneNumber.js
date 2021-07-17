import { useContext, useState } from 'react';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/ConfirmPhoneNumber.module.css';

export default function ConfirmPhoneNumber({ phoneNumber, onSuccess }) {
  const [code, setCode] = useState(null);

  const {
    modal: { hideModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { phoneNumberVerification, sendPhoneNumberVerification } = useContext(UserContext);

  const submitHandler = (event) => {
    event.preventDefault();
    event.target.reset();

    asyncWaiter(
      async () => {
        await phoneNumberVerification({ phoneNumber, code });

        onSuccess();
        hideModal();
      },
      true,
      'Phone number verified'
    );
  };

  const sendHandler = () =>
    asyncWaiter(async () => await sendPhoneNumberVerification(phoneNumber), true, 'Verification code sent');

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <p className={styles.confirmPhoneNumber}>
        We&apos;ve sent a verification code to your phone number. Please check and enter the code here.{' '}
        <button type="button" onClick={sendHandler}>
          Resend verification code
        </button>
      </p>

      <form onSubmit={submitHandler}>
        <input
          type="number"
          name="code"
          id="code"
          minLength="6"
          maxLength="6"
          onInput={(event) => {
            if (event.target.value.length > event.target.maxLength) {
              event.target.value = event.target.value.slice(0, event.target.maxLength);
            }
          }}
          onKeyDown={(event) => {
            if (['e', '+', '-', '.'].includes(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter code"
          required
        />

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
