import { useContext } from 'react';

import Auth from '../../Modal/Auth';
import Rate from '../../Modal/Rate';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';
import RatingsContext from '../../../context/User/RatingsContext';

import styles from '../../../styles/Product/ProductRating.module.css';

import { StarIcon } from '../../../utils/icons';
import Star from '../../../utils/getStar';

export default function ProductRating({ product }) {
  const {
    modal: { showModal },
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { ratings } = useContext(RatingsContext);

  const rate = ratings ? ratings.reduce((a, b) => a + b.rate, 0) / ratings.length : null;

  const rateHandler = () => {
    if (user && user !== 'public') {
      showModal(<Rate product={product} />);
    } else {
      showModal(<Auth />);
    }
  };

  return (
    <div className={styles.rating}>
      <div>
        <span>
          <Star rate={rate} point={1} />
        </span>
        <span>
          <Star rate={rate} point={2} />
        </span>
        <span>
          <Star rate={rate} point={3} />
        </span>
        <span>
          <Star rate={rate} point={4} />
        </span>
        <span>
          <Star rate={rate} point={5} />
        </span>
      </div>

      <span>({ratings.length})</span>

      <button type="button" className={styles.rateBtn} onClick={rateHandler}>
        <span>Rate</span>
        <span className="inline-icon">
          <StarIcon />
        </span>
      </button>
    </div>
  );
}
