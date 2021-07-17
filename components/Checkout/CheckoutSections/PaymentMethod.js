import styles from '../../../styles/Checkout/CheckoutSections.module.css';

import { ArrowLeftIcon, PayPalLogo, StripeLogo } from '../../../utils/icons';

export default function PaymentMethod({ order, setOrder, setStep }) {
  const submitHandler = (event) => {
    event.preventDefault();

    setStep(4);
  };

  return (
    <>
      <h1 className={styles.title}>
        <button type="button" className="inline-icon" onClick={() => setStep(2)}>
          <ArrowLeftIcon />
        </button>
        <span>Payment Method</span>
      </h1>

      <section className={styles.section}>
        <form className={styles.options} onSubmit={submitHandler}>
          <div className="form-group">
            <div className={`${styles.radioLogo} input-radio`}>
              <span>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paypal"
                  value="PayPal"
                  defaultChecked={order && (!order.paymentMethod || order.paymentMethod === 'PayPal')}
                  onChange={(event) => setOrder({ ...order, paymentMethod: event.target.value })}
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
                  defaultChecked={order && order.paymentMethod === 'Stripe'}
                  onChange={(event) => setOrder({ ...order, paymentMethod: event.target.value })}
                />
                <label htmlFor="stripe">
                  <StripeLogo />
                </label>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-block btn-primary" disabled={!order?.paymentMethod}>
            Next
          </button>
        </form>
      </section>
    </>
  );
}
