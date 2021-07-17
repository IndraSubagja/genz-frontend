import { useContext } from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import Auth from '../../../Modal/Auth';

import GeneralContext from '../../../../context/GeneralContext';
import UserContext from '../../../../context/UserContext';
import RatingsContext from '../../../../context/User/RatingsContext';

import CustomLink from '../../../../utils/customLink';
import Star from '../../../../utils/getStar';
import { getDateTime } from '../../../../utils/optimizeTime';
import { getImageUrl } from '../../../../utils/urls';
import {
  EllipsisIcon,
  ThumbsDownIcon,
  ThumbsDownOutlineIcon,
  ThumbsUpIcon,
  ThumbsUpOutlineIcon,
} from '../../../../utils/icons';

export default function ProductReviews({ className }) {
  const {
    modal: { showModal },
    showError,
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { ratings, setExpression } = useContext(RatingsContext);

  const likeHandler = async (id) => {
    if (user && user !== 'public') {
      try {
        await setExpression(id, { type: 'likes', user: user.id, opposite: 'dislikes' });
      } catch (error) {
        if (error.response.status === 500) {
          showError('Too many attempts', false);
        } else {
          showError(error, false);
        }
      }
    } else {
      showModal(<Auth />);
    }
  };

  const dislikeHandler = async (id) => {
    if (user && user !== 'public') {
      try {
        await setExpression(id, { type: 'dislikes', user: user.id, opposite: 'likes' });
      } catch (error) {
        if (error.response.status === 500) {
          showError('Too many attempts', false);
        } else {
          showError(error, false);
        }
      }
    } else {
      showModal(<Auth />);
    }
  };

  return (
    <ul className={className}>
      {!ratings.length ? (
        <p className="empty">There&apos;s no review available for this product.</p>
      ) : (
        ratings.map((rating, index) => {
          const review = unified()
            .use(parse)
            .use(remark2react, {
              remarkReactComponents: {
                // Use CustomLink instead of <a>
                a: CustomLink,
              },
            })
            .processSync(rating.review).result;

          return (
            <li key={rating.id}>
              <div>
                <div>
                  {rating.avatar ? (
                    <img src={getImageUrl(rating.avatar.url)} alt="Avatar" />
                  ) : (
                    <>
                      <span>{rating.name.split(' ').map((item) => item[0].toUpperCase())}</span>
                      <img src="data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-ellipsis ellipsis-1">{rating.name}</h3>
                  <h6>{getDateTime(rating.updatedAt)}</h6>
                </div>
                <div>
                  <div>
                    <button type="button" onClick={() => likeHandler(rating.id)}>
                      <span>
                        {ratings[index].likes.find((like) => like?.user === user?.id) ? (
                          <ThumbsUpIcon />
                        ) : (
                          <ThumbsUpOutlineIcon />
                        )}
                      </span>
                    </button>
                    <p>{rating.likes.length}</p>
                  </div>
                  <div>
                    <button type="button" onClick={() => dislikeHandler(rating.id)}>
                      <span>
                        {ratings[index].dislikes.find((dislike) => dislike?.user === user?.id) ? (
                          <ThumbsDownIcon />
                        ) : (
                          <ThumbsDownOutlineIcon />
                        )}
                      </span>
                    </button>
                    <p>{rating.dislikes.length}</p>
                  </div>
                  <div>
                    <button type="button">
                      <span>
                        <EllipsisIcon />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <span>
                  <Star rate={rating.rate} point={1} />
                </span>
                <span>
                  <Star rate={rating.rate} point={2} />
                </span>
                <span>
                  <Star rate={rating.rate} point={3} />
                </span>
                <span>
                  <Star rate={rating.rate} point={4} />
                </span>
                <span>
                  <Star rate={rating.rate} point={5} />
                </span>
              </div>

              <div>{review}</div>

              <div>
                <div>
                  <button type="button" onClick={() => likeHandler(rating.id)}>
                    <span>
                      {ratings[index].likes.find((like) => like?.user === user?.id) ? (
                        <ThumbsUpIcon />
                      ) : (
                        <ThumbsUpOutlineIcon />
                      )}
                    </span>
                  </button>
                  <p>{rating.likes.length}</p>
                </div>
                <div>
                  <button type="button" onClick={() => dislikeHandler(rating.id)}>
                    <span>
                      {ratings[index].dislikes.find((dislike) => dislike?.user === user?.id) ? (
                        <ThumbsDownIcon />
                      ) : (
                        <ThumbsDownOutlineIcon />
                      )}
                    </span>
                  </button>
                  <p>{rating.dislikes.length}</p>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}
