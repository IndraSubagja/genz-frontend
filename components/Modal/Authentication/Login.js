import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';
import CartContext from '../../../context/User/CartContext';
import WishlistContext from '../../../context/User/WishlistContext';

import styles from '../../../styles/Modal/Auth.module.css';

import { CrossIcon, EyeCloseIcon, EyeIcon } from '../../../utils/icons';
import ConfirmEmail from '../ConfirmEmail';

export default function Login({ setForgot, query }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const {
    modal: { showModal, changeModal, hideModal },
    loading: { hideLoading },
    notification: { showNotification },
    asyncWaiter,
    showError,
  } = useContext(GeneralContext);
  const { userLogin } = useContext(UserContext);
  const { getCart } = useContext(CartContext);
  const { getWishlist } = useContext(WishlistContext);

  const loginHandler = (event) => {
    event.preventDefault();
    event.target.reset();

    asyncWaiter(
      async () => {
        const user = await userLogin({ email, password });

        getCart(user);
        getWishlist(user);

        showNotification(true, `${user.lastLoggedIn ? 'Welcome back' : 'Welcome'}, ${user.name.split(' ')[0]}!`);

        if (query && query.redirected === 'order') {
          router.push(`/orders/${query.id}`, undefined, { shallow: true });
        } else {
          hideLoading();
        }
        hideModal();
      },
      false,
      '',
      (error) => {
        showError(error);

        const errorId = error?.response?.data?.message?.[0]?.messages?.[0]?.id;

        if (errorId && errorId.split('.')[4] === 'not-confirmed') {
          showModal(<ConfirmEmail email={email} />, true);
        }
      }
    );
  };

  return (
    <div className={styles.authBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <h2>Login to Your Account</h2>

      <form onSubmit={loginHandler}>
        <div className="input-control">
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            name="loginEmail"
            id="loginEmail"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="input-control">
          <label htmlFor="loginPassword">Password</label>
          <input
            type={show ? 'text' : 'password'}
            name="loginPassword"
            id="loginPassword"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="button" className="inline-input-icon" onClick={() => setShow(!show)}>
            <span>{show ? <EyeCloseIcon /> : <EyeIcon />}</span>
          </button>
          <div>
            <button type="button" onClick={() => setForgot(true)}>
              Forgot Password?
            </button>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-block btn-primary">
            Login
          </button>
        </div>
      </form>

      <p>
        New customer?{' '}
        <button type="button" onClick={() => changeModal(1)}>
          Create your account
        </button>
      </p>
    </div>
  );
}
