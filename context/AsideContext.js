import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

import UserContext from './UserContext';

import { API_URL } from '../utils/urls';

const AsideContext = createContext();

export function AsideProvider({ children }) {
  const [aside, setAside] = useState({});
  const [cart, setCart] = useState(null);

  const { updateUserCart, showLoading, hideLoading, showNotification } = useContext(UserContext);

  const showAside = (active) => {
    setAside({ state: true, active });
  };
  const hideAside = () => {
    setAside({ ...aside, state: false });
  };
  const changeActive = (active) => {
    setAside({ ...aside, active });
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
    const inCart = cart?.find((cartItem) => cartItem.product.id === item.product.id);

    if (inCart) {
      inCart.qty = item.qty;
      setCart(cart);
      localStorage.setItem('tempCart', JSON.stringify(cart));
    } else {
      setCart([...cart, item]);
      localStorage.setItem('tempCart', JSON.stringify([...cart, item]));
    }
  };

  const updateTempCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('tempCart', JSON.stringify(updatedCart));
  };

  const saveCart = async (user, updatedCart) => {
    showLoading(0.8);

    try {
      const { data } = await axios.put(`${API_URL}/users/me/cart`, updatedCart, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });

      showNotification(true, 'Cart updated successfully');
      hideLoading();

      updateUserCart(data.cart);
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      showNotification(false, message);
      hideLoading();
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
        cart,
        showAside,
        hideAside,
        changeActive,
        optimizeHideAside,
        getCart,
        addToCart,
        updateTempCart,
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
