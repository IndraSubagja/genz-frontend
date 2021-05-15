import { useContext, useEffect, useState } from 'react';
import AsideContext from '../../context/AsideContext';

import ModalContext from '../../context/ModalContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal.module.css';

import { CrossIcon } from '../../utils/icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, userLogin } = useContext(UserContext);
  const { cart, getCart } = useContext(AsideContext);
  const { setActive, hideModal, optimizeHideModal } = useContext(ModalContext);

  const loginHandler = (event) => {
    event.preventDefault();

    userLogin({ identifier: email, password });
    event.currentTarget.reset();
  };

  useEffect(() => {
    if (user && !cart) {
      hideModal();
      getCart(user);
    }
  }, [user]);

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onMouseDown={optimizeHideModal}>
        <CrossIcon />
      </button>

      <h2>Login to Your Account</h2>

      <form onSubmit={loginHandler}>
        <div>
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            name="loginEmail"
            id="loginEmail"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter Your Email Address"
            required
          />
        </div>
        <div>
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            name="loginPassword"
            id="loginPassword"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter Your Password"
            required
          />
        </div>

        <button type="submit" className="btn btn-block btn-primary">
          Login
        </button>
      </form>

      <p>
        New customer? <a onClick={() => setActive(1)}>Create your account</a>
      </p>
    </div>
  );
}
