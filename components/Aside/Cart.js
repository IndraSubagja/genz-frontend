import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';
import CartContext from '../../context/User/CartContext';
import WishlistContext from '../../context/User/WishlistContext';

import styles from '../../styles/Aside/Cart.module.css';

import { compareCartData } from '../../utils/compareData';
import { ArrowBottomIcon, ArrowUpIcon, RestoreIcon, TrashcanIcon } from '../../utils/icons';
import optimizePrice from '../../utils/optimizePrice';
import { getImageUrl } from '../../utils/urls';

export default function Cart() {
  const router = useRouter();

  const {
    loading: { hideLoading },
    notification: { showNotification },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { user, updateUserData } = useContext(UserContext);
  const { cart, getCart, updateCart, clearCart, removeFromCart } = useContext(CartContext);
  const { wishlist, addToWishlist } = useContext(WishlistContext);

  const incrementQty = (index) => {
    updateCart(index, cart[index].qty + 1);
  };
  const decrementQty = (index) => {
    updateCart(index, cart[index].qty - 1);
  };

  const saveHandler = (proceed = false) =>
    asyncWaiter(async () => {
      if (!compareCartData(cart, user.cart)) {
        await updateUserData({ cart });

        showNotification(true, 'Cart updated successfully');
      }

      if (proceed) {
        router.push('/checkout', undefined, { shallow: true });
      } else {
        hideLoading();
      }
    });

  return (
    <div className={styles.sectionContainer}>
      {!cart.length ? (
        <p className="empty">There&apos;s no product in your cart.</p>
      ) : (
        <>
          <ul className={styles.itemsContainer}>
            {cart.map((item, index) => {
              const inWishlist = wishlist.find((wishlistItem) => wishlistItem.product.id === item.product.id);

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
                      <button type="button" onClick={() => removeFromCart(item.product)}>
                        <span>Remove</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          asyncWaiter(
                            async () => await addToWishlist({ product: item.product }),
                            true,
                            'Product added to wishlist'
                          )
                        }
                        disabled={inWishlist}
                      >
                        <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={cart[index].qty >= (item.product.stock >= 10 ? 10 : item.product.stock)}
                      onClick={() => incrementQty(index)}
                    >
                      <ArrowUpIcon />
                    </button>
                    <p>{cart[index].qty}</p>
                    <button type="button" disabled={cart[index].qty <= 1} onClick={() => decrementQty(index)}>
                      <ArrowBottomIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <h3>Total: {optimizePrice(cart.reduce((a, b) => a + b.product.price * b.qty, 0))}</h3>
        </>
      )}

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => getCart(user)}
          disabled={compareCartData(cart, user?.cart)}
        >
          <span className="inline-icon">
            <RestoreIcon />
          </span>
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => saveHandler()}
          disabled={compareCartData(cart, user?.cart)}
        >
          {router.asPath === '/checkout' ? 'Update Items' : 'Save'}
        </button>
        <button type="button" className="btn btn-danger" onClick={clearCart} disabled={!cart.length}>
          <span className="inline-icon">
            <TrashcanIcon />
          </span>
        </button>
      </div>
      {router.asPath !== '/checkout' && (
        <button
          type="button"
          className="btn btn-block btn-primary"
          onClick={() => saveHandler(true)}
          disabled={!cart.length || router.query.product}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
