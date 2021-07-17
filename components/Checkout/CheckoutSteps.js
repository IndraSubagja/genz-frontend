import styles from '../../styles/Checkout.module.css';

export default function CheckoutSteps({ step }) {
  return (
    <>
      <style jsx>{`
        .${styles.steps} > div {
          background: linear-gradient(90deg, var(--secondary) ${step * 25}%, var(--grey) ${step * 25}%);
        }
        .${styles.steps} > div > div:nth-child(-n + ${step}) {
          background-color: var(--secondary);
        }
      `}</style>

      <div className={styles.steps}>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
}
