import { useEffect, useState } from 'react';

import PaymentMethod from './ProfileSections/PaymentMethod';
import PersonalInformation from './ProfileSections/PersonalInformation';
import ShippingAddress from './ProfileSections/ShippingAddress';
import OrderInformation from './ProfileSections/OrderInformation';

import styles from '../../styles/Profile/ProfileSections.module.css';

export default function ProfileSections({ user }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const setSliderWidth = () => {
      const slider = document.querySelector(`.${styles.sectionsSlider}`);
      const header = document.querySelectorAll(`.${styles.sectionsHeader} > button`);

      const initialPos = header[0].getBoundingClientRect().left;
      const { left: activePos, width: activeWidth } = header[active].getBoundingClientRect();

      const sliderPos = activePos - initialPos;

      slider.style.left = `${sliderPos}px`;
      slider.style.width = `${activeWidth}px`;
    };

    setSliderWidth();

    window.addEventListener('resize', setSliderWidth);

    return () => window.removeEventListener('resize', setSliderWidth);
  }, [active]);

  return (
    <>
      <style jsx>
        {`
          .${styles.sectionsBody} > li {
            transform: translateX(${active * -100}%);
          }
          .${styles.sectionsBody} > li:nth-child(-n + ${active}),
          .${styles.sectionsBody} > li:nth-last-child(-n + ${3 - active}) {
            visibility: hidden;
          }
        `}
      </style>

      <div className={styles.sections}>
        <div className={styles.sectionsHeader}>
          <button type="button" onClick={() => setActive(0)} className={active === 0 ? styles.active : ''}>
            <h2>Personal Information</h2>
          </button>
          <button type="button" onClick={() => setActive(1)} className={active === 1 ? styles.active : ''}>
            <h2>Shipping Address</h2>
          </button>
          <button type="button" onClick={() => setActive(2)} className={active === 2 ? styles.active : ''}>
            <h2>Payment Method</h2>
          </button>
          <button type="button" onClick={() => setActive(3)} className={active === 3 ? styles.active : ''}>
            <h2>Order Information</h2>
          </button>
          <div className={styles.sectionsSlider}></div>
        </div>

        <ul className={styles.sectionsBody}>
          <li>
            <PersonalInformation user={user} />
          </li>
          <li>
            <ShippingAddress user={user} />
          </li>
          <li>
            <PaymentMethod user={user} />
          </li>
          <li>
            <OrderInformation user={user} />
          </li>
        </ul>
      </div>
    </>
  );
}
