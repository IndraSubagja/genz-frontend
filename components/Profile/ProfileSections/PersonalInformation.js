import { useContext, useState } from 'react';

import Confirmation from '../../Modal/Confirmation';
import ConfirmPhoneNumber from '../../Modal/ConfirmPhoneNumber';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';

import styles from '../../../styles/Profile/ProfileSections.module.css';

import { ChecklistIcon, CrossIcon, PenIcon } from '../../../utils/icons';

export default function PersonalInformation({ user }) {
  const [form, setForm] = useState(null);
  const [data, setData] = useState(null);

  const {
    modal: { showModal, hideModal },
    loading: { hideLoading },
    notification: { showNotification },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { updateUserData, sendEmailChangeRequest, sendPhoneNumberVerification, forgotPassword } =
    useContext(UserContext);

  const changeEmailHandler = (updatedData) =>
    asyncWaiter(
      async () => {
        await sendEmailChangeRequest(user.email, updatedData.email);

        cancelHandler();
        hideModal();
      },
      true,
      'Email sent'
    );

  const requestChangeEmail = (event, updatedData) => {
    event.preventDefault();

    showModal(
      <Confirmation
        message={
          <>
            An email will be sent to <strong>{user.email}</strong> to request an email change. Would you like to
            continue?
          </>
        }
        accept={() => changeEmailHandler(updatedData)}
        decline={cancelHandler}
      />,
      0
    );
  };

  const changePasswordHandler = () =>
    asyncWaiter(
      async () => {
        await forgotPassword(user.email);
        hideModal();
      },
      true,
      'Email sent'
    );

  const requestResetPassword = () => {
    cancelHandler();

    showModal(
      <Confirmation
        message={
          <>
            An email will be sent to <strong>{user.email}</strong> with the link to change your password. Would you like
            to continue?
          </>
        }
        accept={changePasswordHandler}
        decline={hideModal}
      />,
      0
    );
  };

  const saveHandler = (event, updatedData) => {
    event.preventDefault();

    asyncWaiter(async () => {
      if (updatedData.phoneNumber) {
        await sendPhoneNumberVerification(updatedData.phoneNumber);

        showModal(<ConfirmPhoneNumber phoneNumber={updatedData.phoneNumber} onSuccess={cancelHandler} />, true);
        showNotification(true, 'Verification code sent');
        hideLoading();
      } else {
        await updateUserData(updatedData);

        setForm(null);
        setData(null);

        showNotification(true, 'Data updated successfully');
        hideLoading();
      }
    });
  };

  const restartData = (type) => {
    if (type === 'name') {
      setData({ firstName: user[type].split(' ')[0], lastName: user[type].split(' ')[1] } || '');
    } else {
      setData({ [type]: user[type] || '' });
    }
    setForm(type);
  };

  const cancelHandler = () => {
    setForm(null);
    setData(null);
    hideModal();
  };

  return (
    <section className={styles.section}>
      <div>
        <div className="form-group">
          {form === 'name' ? (
            <form
              className="form-flex"
              onSubmit={(event) => saveHandler(event, { name: `${data.firstName} ${data.lastName}` })}
            >
              <div className="input-control">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  defaultValue={user.name.split(' ')[0]}
                  placeholder="First name"
                  minLength="2"
                  maxLength="20"
                  pattern="[A-Za-z]+"
                  title="Only letter allowed"
                  onChange={(event) => setData({ ...data, firstName: event.target.value })}
                  required
                />
              </div>
              <div className="input-control">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  defaultValue={user.name.split(' ')[1]}
                  placeholder="Last name"
                  minLength="2"
                  maxLength="20"
                  pattern="[A-Za-z]+"
                  title="Only letter allowed"
                  onChange={(event) => setData({ ...data, lastName: event.target.value })}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!data.firstName || !data.lastName || `${data.firstName} ${data.lastName}` === user.name}
                >
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control">
              <label htmlFor="name">Name</label>
              <p className="text-control">
                {user.name || 'Not set'}
                <button type="button" onClick={() => restartData('name')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          {form === 'username' ? (
            <form className="form-flex" onSubmit={(event) => saveHandler(event, data)}>
              <div className="input-control">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  defaultValue={user.username}
                  placeholder="Enter your username"
                  required
                  onChange={(event) => setData({ username: event.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!data.username || data.username === user.username}
                >
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control">
              <label htmlFor="username">Username</label>
              <p className="text-control">
                {user.username || 'Not set'}
                <button type="button" onClick={() => restartData('username')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          {form === 'dateOfBirth' ? (
            <form className="form-flex" onSubmit={(event) => saveHandler(event, data)}>
              <div className="input-control">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  min="1970-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  defaultValue={user.dateOfBirth}
                  onChange={(event) => setData({ dateOfBirth: event.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!data.dateOfBirth || data.dateOfBirth === user.dateOfBirth}
                >
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <p className="text-control">
                {user.dateOfBirth || 'Not set'}
                <button type="button" onClick={() => restartData('dateOfBirth')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          {form === 'gender' ? (
            <form className="form-flex" onSubmit={(event) => saveHandler(event, data)}>
              <div className="input-control">
                <label htmlFor="gender">Gender</label>
                <div className="input-radio">
                  <span>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="Male"
                      defaultChecked={user.gender === 'Male'}
                      onChange={(event) => setData({ gender: event.target.value })}
                    />
                    <label htmlFor="male">Male</label>
                  </span>
                  <span>
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="Female"
                      defaultChecked={user.gender === 'Female'}
                      onChange={(event) => setData({ gender: event.target.value })}
                    />
                    <label htmlFor="female">Female</label>
                  </span>
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!data.gender || data.gender === user.gender}
                >
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control">
              <label htmlFor="gender">Gender</label>
              <p className="text-control">
                {user.gender || 'Not set'}
                <button type="button" onClick={() => restartData('gender')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          {form === 'email' ? (
            <form className="form-flex column-two" onSubmit={(event) => requestChangeEmail(event, data)}>
              <div className="input-control">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={user.email}
                  placeholder="Enter your email"
                  required
                  onChange={(event) => setData({ email: event.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button type="submit" className="btn btn-primary" disabled={!data.email || data.email === user.email}>
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control column-two">
              <label htmlFor="email">Email</label>
              <p className="text-control">
                {user.email || 'Not set'}
                <button type="button" onClick={() => restartData('email')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          {form === 'phoneNumber' ? (
            <form className="form-flex column-two" onSubmit={(event) => saveHandler(event, data)}>
              <div className="input-control">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  defaultValue={user.phoneNumber}
                  pattern="\+\d+"
                  title="Phone number must in international format"
                  placeholder="Enter your phone number"
                  required
                  onChange={(event) => setData({ phoneNumber: event.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-danger" onClick={cancelHandler}>
                  <span className="inline-icon">
                    <CrossIcon />
                  </span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!data.phoneNumber || data.phoneNumber === user.phoneNumber}
                >
                  <span className="inline-icon">
                    <ChecklistIcon />
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="input-control column-two">
              <label htmlFor="phoneNumber">Phone Number</label>
              <p className="text-control">
                {user.phoneNumber || 'Not set'}
                <button type="button" onClick={() => restartData('phoneNumber')}>
                  <span className="inline-icon">
                    <PenIcon />
                  </span>
                </button>
              </p>
            </div>
          )}

          <div className="input-control column-two">
            <button type="button" className="btn btn-block btn-primary" onClick={requestResetPassword}>
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
