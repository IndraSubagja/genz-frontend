import { useContext, useState } from 'react';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';

import styles from '../../../styles/Profile/ProfileSections.module.css';

import { PayPalLogo, StripeLogo } from '../../../utils/icons';

export default function PaymentMethod({ user }) {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const { asyncWaiter } = useContext(GeneralContext);
  const { updateUserData } = useContext(UserContext);

  const submitHandler = (event) => {
    event.preventDefault();

    asyncWaiter(async () => await updateUserData({ paymentMethod }), true, 'Data updated successfully');
  };

  return (
    <section className={styles.section}>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <div className={`${styles.radioLogo} input-radio`}>
            <span>
              <input
                type="radio"
                name="paymentMethod"
                id="paypal"
                value="PayPal"
                defaultChecked={user.paymentMethod === 'PayPal'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <label htmlFor="paypal">
                <PayPalLogo />
              </label>
            </span>
          </div>
          <div className={`${styles.radioLogo} input-radio column-two`}>
            <span>
              <input
                type="radio"
                name="paymentMethod"
                id="stripe"
                value="Stripe"
                defaultChecked={user.paymentMethod === 'Stripe'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <label htmlFor="stripe">
                <StripeLogo />
              </label>
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-block btn-primary"
          disabled={!paymentMethod || paymentMethod === user.paymentMethod}
        >
          Submit
        </button>
      </form>
    </section>
  );
}
