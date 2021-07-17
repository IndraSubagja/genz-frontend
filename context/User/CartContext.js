import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import UserContext from '../UserContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const { user, updateUserData } = useContext(UserContext);

  const getCart = (user) => {
    setCart([...user.cart].map((item) => ({ qty: item.qty, product: item.product })));
  };

  const addToCart = async (product) => {
    await updateUserData({ cart: [...cart, product] });

    setCart([...cart, product]);
  };

  const updateCart = (index, qty) => {
    setCart(
      [...cart].map((item, i) => {
        if (index === i) {
          return { ...item, qty };
        } else {
          return item;
        }
      })
    );
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const removeFromCart = (product) => {
    setCart([...cart].filter((item) => item.product.id !== product.id));
  };

  useEffect(() => {
    if (user && user !== 'public') {
      getCart(user);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addToCart,
        updateCart,
        clearCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
