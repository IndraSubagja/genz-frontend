import styles from '../../styles/Home.module.css';

import Star from '../../utils/getStar';

export default function ProductsRating({ product }) {
  return (
    <div className={styles.rating}>
      <div>
        <span>
          <Star rate={product.rate} point={1} />
        </span>
        <span>
          <Star rate={product.rate} point={2} />
        </span>
        <span>
          <Star rate={product.rate} point={3} />
        </span>
        <span>
          <Star rate={product.rate} point={4} />
        </span>
        <span>
          <Star rate={product.rate} point={5} />
        </span>
      </div>

      <span>({product.rater})</span>
    </div>
  );
}
