import { createContext, useCallback, useContext, useState } from 'react';
import axios from 'axios';

import UserContext from '../UserContext';

const RatingsContext = createContext();

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState([]);

  const { getToken, getUser } = useContext(UserContext);

  const updateProductRating = async (id, rating) => {
    const token = await getToken();

    await axios.put(`products/${id}`, rating, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  const getRating = useCallback(async (id) => {
    const { data } = await axios.get('/ratings', { params: { product: id } });

    setRatings(data);
  }, []);

  const createRating = async (rating) => {
    const token = await getToken();

    const { data } = await axios.post('/ratings', rating, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const updatedRatings = [...ratings, data];
    const rater = updatedRatings.length;
    const rate = updatedRatings.reduce((a, b) => a + b.rate, 0) / rater || 0;

    await updateProductRating(rating.product, { rater, rate });
    await getUser();

    setRatings(updatedRatings);
  };

  const updateRating = async (id, rating) => {
    const token = await getToken();

    const { data } = await axios.put(`/ratings/${id}`, rating, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const updatedRatings = [...ratings].map((item) => {
      if (item.id === id) {
        return data;
      } else {
        return item;
      }
    });
    const rater = updatedRatings.length;
    const rate = updatedRatings.reduce((a, b) => a + b.rate, 0) / rater || 0;

    await updateProductRating(rating.product, { rater, rate });
    await getUser();

    setRatings(updatedRatings);
  };

  const deleteRating = async (id, product) => {
    const token = await getToken();

    await axios.delete(`/ratings/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const updatedRatings = [...ratings].filter((rating) => rating.id !== id);
    const rater = updatedRatings.length;
    const rate = updatedRatings.reduce((a, b) => a + b.rate, 0) / rater || 0;

    await updateProductRating(product, { rater, rate });
    await getUser();

    setRatings(updatedRatings);
  };

  const setExpression = async (id, expression) => {
    const token = await getToken();
    const { type, user, opposite } = expression;
    const rating = ratings.find((item) => item.id === id);
    const expressed = rating[type].find((type) => type.user === user);
    const oppositeExpressed = rating[opposite].find((opposite) => opposite.user === user);

    const updatedRating = {
      ...rating,
      [type]: expressed ? [...rating[type]].filter((type) => type.user !== user) : [...rating[type], { user: user }],
      [opposite]: oppositeExpressed
        ? [...rating[opposite]].filter((opposite) => opposite.user !== user)
        : [...rating[opposite]],
    };

    setRatings(
      [...ratings].map((item) => {
        if (item.id === id) {
          return updatedRating;
        } else {
          return item;
        }
      })
    );

    await axios.put(`/ratings/${id}`, updatedRating, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    await getUser();
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        getRating,
        createRating,
        updateRating,
        deleteRating,
        setExpression,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
}

export default RatingsContext;
