import { createContext, useContext, useEffect, useState } from 'react';

import UserContext from '../UserContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const { user, updateUserData } = useContext(UserContext);

  const getWishlist = (user) => {
    setWishlist([...user.wishlist].map((item) => ({ product: item.product })));
  };

  const addToWishlist = async (product) => {
    await updateUserData({ wishlist: [...wishlist, product] });

    setWishlist([...wishlist, product]);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const removeFromWishlist = async (product, auto = false) => {
    if (auto) {
      await updateUserData({ wishlist: wishlist.filter((item) => item.product.id !== product.id) });
    }

    setWishlist([...wishlist].filter((item) => item.product.id !== product.id));
  };

  useEffect(() => {
    if (user && user !== 'public') {
      getWishlist(user);
    }
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        getWishlist,
        addToWishlist,
        clearWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;
