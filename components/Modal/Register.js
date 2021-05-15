import { useContext, useEffect, useState } from 'react';

import ModalContext from '../../context/ModalContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal.module.css';

import { CrossIcon } from '../../utils/icons';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, userRegister } = useContext(UserContext);
  const { setActive, hideModal, optimizeHideModal } = useContext(ModalContext);

  const registerHandler = (event) => {
    event.preventDefault();

    userRegister({ username, email, password });
    event.currentTarget.reset();
  };

  useEffect(() => {
    if (user) {
      hideModal();
    }
  }, [user]);

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onMouseDown={optimizeHideModal}>
        <CrossIcon />
      </button>

      <h2>Create Your Account</h2>

      <form onSubmit={registerHandler}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter Your Username"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter Your Email Address"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter Your Password"
            required
          />
        </div>

        <button type="submit" className="btn btn-block btn-primary">
          Create Account
        </button>
      </form>

      <p>
        Already have an account? <a onClick={() => setActive(0)}>Login</a>
      </p>
    </div>
  );
}
