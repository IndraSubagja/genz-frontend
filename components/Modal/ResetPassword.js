import { useContext, useState } from 'react';

import Auth from './Auth';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/ResetPassword.module.css';
import { EyeCloseIcon, EyeIcon } from '../../utils/icons';

export default function ResetPassword({ code }) {
  const [password, setPassword] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState(null);
  const [show, setShow] = useState(false);

  const {
    modal: { showModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { resetPassword } = useContext(UserContext);

  const submitHandler = (event) => {
    event.preventDefault();
    event.target.reset();

    asyncWaiter(
      async () => {
        await resetPassword({ password, passwordConfirmation, code });
        showModal(<Auth />);
      },
      true,
      'Password changed successfully'
    );
  };

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <h2 className={styles.resetPassword}>Reset Password</h2>

      <form onSubmit={submitHandler}>
        <div className="input-control">
          <label htmlFor="password">New Password</label>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Set your new password"
            pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            title="Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="button" className="inline-input-icon" onClick={() => setShow(!show)}>
            <span>{show ? <EyeCloseIcon /> : <EyeIcon />}</span>
          </button>
        </div>
        <div className="input-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder="Confirm your new password"
            required
          />
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
