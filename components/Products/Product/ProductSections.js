import { useEffect, useState } from 'react';

import ProductDescription from './ProductSections/ProductDescription';
import ProductFeatures from './ProductSections/ProductFeatures';
import ProductSpecifications from './ProductSections/ProductSpecifications';
import ProductReviews from './ProductSections/ProductReviews';

import styles from '../../../styles/Product/ProductSections.module.css';

export default function ProductSections({ product }) {
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
            <h3>Description</h3>
          </button>
          <button type="button" onClick={() => setActive(1)} className={active === 1 ? styles.active : ''}>
            <h3>Features</h3>
          </button>
          <button type="button" onClick={() => setActive(2)} className={active === 2 ? styles.active : ''}>
            <h3>Specifications</h3>
          </button>
          <button type="button" onClick={() => setActive(3)} className={active === 3 ? styles.active : ''}>
            <h3>Reviews</h3>
          </button>
          <div className={styles.sectionsSlider}></div>
        </div>

        <ul className={styles.sectionsBody}>
          <li>
            <ProductDescription product={product} className={styles.description} />
          </li>
          <li>
            <ProductFeatures product={product} className={styles.features} />
          </li>
          <li>
            <ProductSpecifications product={product} className={styles.specifications} />
          </li>
          <li>
            <ProductReviews className={styles.reviews} />
          </li>
        </ul>
      </div>
    </>
  );
}
