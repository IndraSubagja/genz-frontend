import Link from 'next/link';
import { useContext } from 'react';

import AsideContext from '../../context/AsideContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Aside/Cart.module.css';

import { compareCartData } from '../../utils/compareData';
import { ArrowBottomIcon, ArrowUpIcon } from '../../utils/icons';
import optimizePrice from '../../utils/optimizePrice';
import { imageUrl } from '../../utils/urls';

export default function Cart() {
  const { user } = useContext(UserContext);
  const { cart, setCart, saveCart, clearCart, removeFromCart } = useContext(AsideContext);

  const incrementQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty += 1;

    setCart(updatedCart);
    localStorage.setItem('tempCart', JSON.stringify(updatedCart));
  };
  const decrementQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty -= 1;

    setCart(updatedCart);
    localStorage.setItem('tempCart', JSON.stringify(updatedCart));
  };

  return (
    <div className={styles.sectionContainer}>
      <ul className={styles.itemsContainer}>
        {cart?.map((item, index) => (
          <li key={item.product.id}>
            <img src={imageUrl(item.product.images[0].url)} alt={item.product.title} />

            <div>
              <Link href={`/products/${item.product.id}`}>
                <a>
                  <h3>{item.product.title}</h3>
                </a>
              </Link>
              <h4 className="price">{optimizePrice(item.product.price)}</h4>
              <div>
                <a onClick={() => removeFromCart(item.product)}>
                  <span>Remove</span>
                </a>
                <a>
                  <span>Add to Wishlist</span>
                </a>
              </div>
            </div>

            <div>
              <button type="button" disabled={cart[index].qty >= 8} onClick={() => incrementQty(index)}>
                <ArrowUpIcon />
              </button>
              <p>{cart[index].qty}</p>
              <button type="button" disabled={cart[index].qty <= 1} onClick={() => decrementQty(index)}>
                <ArrowBottomIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <button
          type="submit"
          className="btn btn-block btn-primary"
          onClick={() => saveCart(user, cart)}
          disabled={compareCartData(cart, user.cart)}
        >
          Save
        </button>
        <button type="submit" className="btn btn-block btn-danger" onClick={clearCart} disabled={!cart?.length}>
          Clear
        </button>
      </div>
      <button type="submit" className="btn btn-block btn-primary">
        Proceed to Checkout
      </button>
    </div>
  );
}
