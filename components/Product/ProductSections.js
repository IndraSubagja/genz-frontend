import { useState } from 'react';

import ProductDescription from './ProductSections/ProductDescription';
import ProductFeatures from './ProductSections/ProductFeatures';
import ProductSpecifications from './ProductSections/ProductSpecifications';

import styles from '../../styles/Product/ProductSections.module.css';

export default function ProductSections({ product }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <style jsx>
        {`
          .${styles.sectionsSlider} {
            transform: translateX(${active * 100}%);
          }
          .${styles.sectionsBody} > li {
            transform: translateX(${active * -100}%);
          }
        `}
      </style>

      <div className={styles.sections}>
        <div className={styles.sectionsHeader}>
          <a onClick={() => setActive(0)} className={active === 0 ? styles.active : ''}>
            <h3>Description</h3>
          </a>
          <a onClick={() => setActive(1)} className={active === 1 ? styles.active : ''}>
            <h3>Features</h3>
          </a>
          <a onClick={() => setActive(2)} className={active === 2 ? styles.active : ''}>
            <h3>Specifications</h3>
          </a>
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
        </ul>
      </div>
    </>
  );
}
