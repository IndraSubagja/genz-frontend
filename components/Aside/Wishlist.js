import Link from 'next/link';
import { useContext } from 'react';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';
import CartContext from '../../context/User/CartContext';
import WishlistContext from '../../context/User/WishlistContext';

import styles from '../../styles/Aside/Wishlist.module.css';

import { compareWishlistData } from '../../utils/compareData';
import optimizePrice from '../../utils/optimizePrice';
import { getImageUrl } from '../../utils/urls';
import { RestoreIcon, TrashcanIcon } from '../../utils/icons';

export default function Wishlist() {
  const { asyncWaiter } = useContext(GeneralContext);
  const { user, updateUserData } = useContext(UserContext);
  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, getWishlist, clearWishlist, removeFromWishlist } = useContext(WishlistContext);

  const saveHandler = () =>
    asyncWaiter(async () => await updateUserData({ wishlist }), true, 'Wishlist updated successfully');

  return (
    <div className={styles.sectionContainer}>
      {!wishlist.length ? (
        <p className="empty">There&apos;s no product in your wishlist.</p>
      ) : (
        <ul className={styles.itemsContainer}>
          {wishlist.map((item) => {
            const inCart = cart.find((cartItem) => cartItem.product.id === item.product.id);

            return (
              <li key={item.product.id}>
                <img src={getImageUrl(item.product.images[0].url)} alt={item.product.title} />

                <div>
                  <Link href={`/products/${item.product.id}`}>
                    <a>
                      <h3 className="text-ellipsis ellipsis-2">{item.product.title}</h3>
                    </a>
                  </Link>
                  <h4 className="price">{optimizePrice(item.product.price)}</h4>
                  <div>
                    <button type="button" onClick={() => removeFromWishlist(item.product)}>
                      <span>Remove</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        asyncWaiter(
                          async () => await addToCart({ qty: 1, product: item.product }),
                          true,
                          'Product added to cart'
                        )
                      }
                      disabled={inCart || !item.product.stock}
                    >
                      <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => getWishlist(user)}
          disabled={compareWishlistData(wishlist, user?.wishlist)}
        >
          <span className="inline-icon">
            <RestoreIcon />
          </span>
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveHandler}
          disabled={compareWishlistData(wishlist, user?.wishlist)}
        >
          Save
        </button>
        <button type="button" className="btn btn-danger" onClick={clearWishlist} disabled={!wishlist.length}>
          <span className="inline-icon">
            <TrashcanIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
