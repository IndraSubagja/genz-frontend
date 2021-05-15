import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

import UserContext from './UserContext';

import { API_URL } from '../utils/urls';

const AsideContext = createContext();

export function AsideProvider({ children }) {
  const [aside, setAside] = useState(false);
  const [active, setActive] = useState(0);
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState([]);

  const { setUser } = useContext(UserContext);

  const showAside = async (active) => {
    setActive(active);
    setAside(true);
  };

  const hideAside = () => {
    setAside(false);
  };

  const optimizeHideAside = (event) => {
    if (event.button === 0) {
      const target = event.target;

      const activate = (event) => {
        if (target === event.target) {
          hideAside();
        }
      };

      target.addEventListener('mouseup', activate, { once: true });
    }
  };

  const getCart = (user) => {
    setCart([...user.cart.map((item) => ({ qty: item.qty, product: item.product }))]);
    localStorage.setItem(
      'tempCart',
      JSON.stringify([...user.cart.map((item) => ({ qty: item.qty, product: item.product }))])
    );
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem('tempCart', JSON.stringify([...cart, item]));
  };

  const saveCart = async (user, updatedCart) => {
    try {
      const { data } = await axios.put(`${API_URL}/users/me/cart`, updatedCart, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });

      setUser({ ...user, cart: [...data.cart] });
      localStorage.setItem('userInfo', JSON.stringify({ ...user, cart: [...data.cart] }));
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      setMessage(message);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('tempCart', JSON.stringify([]));
  };

  const removeFromCart = (product) => {
    setCart(cart.filter((item) => item.product.id !== product.id));
    localStorage.setItem('tempCart', JSON.stringify(cart.filter((item) => item.product.id !== product.id)));
  };

  const dropCart = () => {
    setCart(null);
    localStorage.removeItem('tempCart');
  };

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('tempCart')));
  }, []);

  return (
    <AsideContext.Provider
      value={{
        aside,
        active,
        cart,
        setActive,
        showAside,
        hideAside,
        optimizeHideAside,
        getCart,
        addToCart,
        saveCart,
        clearCart,
        removeFromCart,
        dropCart,
      }}
    >
      {children}
    </AsideContext.Provider>
  );
}

export default AsideContext;
