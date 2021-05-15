import styles from '../../styles/Product/ProductRating.module.css';

import { StarIcon, StarHalfIcon, StarEmptyIcon } from '../../utils/icons';

const Star = ({ score, point }) =>
  score >= point ? <StarIcon /> : score >= point - 0.5 ? <StarHalfIcon /> : <StarEmptyIcon />;

export default function Rating({ product }) {
  return (
    <div className={styles.rating}>
      <div>
        <span>
          <Star score={product.rating} point={1} />
        </span>
        <span>
          <Star score={product.rating} point={2} />
        </span>
        <span>
          <Star score={product.rating} point={3} />
        </span>
        <span>
          <Star score={product.rating} point={4} />
        </span>
        <span>
          <Star score={product.rating} point={5} />
        </span>
      </div>

      <span>({product.ratings.length})</span>
    </div>
  );
}
