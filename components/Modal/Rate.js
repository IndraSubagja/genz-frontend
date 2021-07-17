import { useContext, useState } from 'react';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';
import RatingsContext from '../../context/User/RatingsContext';

import styles from '../../styles/Modal/Rate.module.css';

import { CrossIcon, StarEmptyIcon, StarIcon } from '../../utils/icons';

export default function Rate({ product }) {
  const {
    modal: { hideModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { createRating, updateRating, deleteRating } = useContext(RatingsContext);

  const userRating = user?.ratings.find((item) => item.product === product.id);

  const [rate, setRate] = useState(userRating?.rate || 5);
  const [review, setReview] = useState(userRating?.review || '');

  const submitHandler = (event) => {
    event.preventDefault();

    asyncWaiter(
      async () => {
        if (userRating) {
          await updateRating(userRating.id, {
            product: product.id,
            user: user.id,
            name: user.name,
            avatar: user.avatar || null,
            rate,
            review,
          });
        } else {
          await createRating({
            product: product.id,
            user: user.id,
            name: user.name,
            avatar: user.avatar || null,
            rate,
            review,
          });
        }

        hideModal();
      },
      true,
      `Rating ${userRating ? 'edited' : 'posted'}`
    );
  };

  const deleteHandler = () =>
    asyncWaiter(
      async () => {
        await deleteRating(userRating.id, product.id);

        hideModal();
      },
      true,
      'Rating deleted'
    );

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <h2 className={styles.rate}>Rate This Product</h2>

      <form onSubmit={submitHandler}>
        <div className="input-control">
          {[...Array(5).keys()].map((x) => (
            <span key={x + 1}>
              <input
                type="radio"
                name="rating"
                id={x + 1}
                value={x + 1}
                defaultChecked={rate === x + 1}
                onChange={(event) => setRate(event.target.value)}
                required
              />
              <label htmlFor={x + 1}>{rate < x + 1 ? <StarEmptyIcon /> : <StarIcon />}</label>
            </span>
          ))}
        </div>
        <div className="input-control">
          <textarea
            name="review"
            id="review"
            cols="30"
            rows="10"
            defaultValue={review}
            placeholder="What do you think about this product?"
            onChange={(event) => setReview(event.target.value)}
          ></textarea>
        </div>

        <div>
          {userRating && (
            <button type="button" className="btn btn-block btn-danger" onClick={deleteHandler}>
              Delete
            </button>
          )}
          <button type="submit" className="btn btn-block btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
