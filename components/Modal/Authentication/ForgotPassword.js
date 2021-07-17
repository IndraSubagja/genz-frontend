import { useContext, useState } from 'react';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';

import styles from '../../../styles/Modal/Auth.module.css';

import { CrossIcon } from '../../../utils/icons';

export default function ForgotPassword({ setForgot }) {
  const [email, setEmail] = useState(null);

  const {
    modal: { hideModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { forgotPassword } = useContext(UserContext);

  const submitHandler = (event) => {
    event.preventDefault();
    event.target.reset();

    asyncWaiter(
      async () => {
        await forgotPassword(email);
        hideModal();
      },
      true,
      'Email sent'
    );
  };

  return (
    <div className={styles.authBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <h2>Forgot Password</h2>

      <form onSubmit={submitHandler}>
        <div className="input-control">
          <label htmlFor="forgotEmail">Email</label>
          <input
            type="email"
            name="forgotEmail"
            id="forgotEmail"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            required
          />
          <div>
            <button type="button" onClick={() => setForgot(false)}>
              Go Back
            </button>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-block btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
