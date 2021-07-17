import { useContext, useState } from 'react';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';

import styles from '../../../styles/Modal/Auth.module.css';
import generateUsername from '../../../utils/generateUsername';

import { CrossIcon, EyeCloseIcon, EyeIcon } from '../../../utils/icons';

export default function Register() {
  const [name, setName] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const {
    modal: { changeModal, hideModal },
    asyncWaiter,
    showError,
  } = useContext(GeneralContext);
  const { checkUsername, userRegister } = useContext(UserContext);

  const registerHandler = (event) => {
    event.preventDefault();

    asyncWaiter(
      async () => {
        const username = generateUsername(name);

        await checkUsername(username);
        await userRegister({ name: `${name[0]} ${name[1]}`, username, email, password });

        event.target.reset();
      },
      true,
      'Please confirm your email',
      (error) => {
        const errorId = error?.response?.data?.message?.[0]?.messages?.[0]?.id;

        if (errorId && errorId.split('.')[3] === 'username' && errorId.split('.')[4] === 'taken') {
          return registerHandler(event);
        }

        showError(error);
      }
    );
  };

  return (
    <div className={styles.authBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <h2>Create Your Account</h2>

      <form onSubmit={registerHandler}>
        <div className="form-flex">
          <div className="input-control">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First name"
              minLength="2"
              maxLength="20"
              pattern="[A-Za-z]+"
              title="Only letter allowed"
              onChange={(event) => setName([event.target.value, name[1]])}
              required
            />
          </div>
          <div className="input-control">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last name"
              minLength="2"
              maxLength="20"
              pattern="[A-Za-z]+"
              title="Only letter allowed"
              onChange={(event) => setName([name[0], event.target.value])}
              required
            />
          </div>
        </div>
        <div className="input-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="input-control">
          <label htmlFor="password">Password</label>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Enter your password"
            pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            title="Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="button" className="inline-input-icon" onClick={() => setShow(!show)}>
            <span>{show ? <EyeCloseIcon /> : <EyeIcon />}</span>
          </button>
        </div>

        <button type="submit" className="btn btn-block btn-primary">
          Create Account
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button type="button" onClick={() => changeModal(0)}>
          Login
        </button>
      </p>
    </div>
  );
}
