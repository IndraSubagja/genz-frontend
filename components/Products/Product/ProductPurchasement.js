import { useContext, useState } from 'react';

import Auth from '../../Modal/Auth';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';
import CartContext from '../../../context/User/CartContext';

import styles from '../../../styles/Product/ProductPurchasement.module.css';

import { CartAddIcon, CartInIcon } from '../../../utils/icons';
import { useRouter } from 'next/router';

export default function ProductPurchasement({ product }) {
  const router = useRouter();

  const [action, setAction] = useState(null);
  const [qty, setQty] = useState(1);

  const {
    modal: { showModal },
    aside: { showAside },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { cart, addToCart, updateCart } = useContext(CartContext);

  const maxQty = product.stock >= 10 ? 10 : product.stock;
  const inCart = cart.find((item) => item.product.id === product.id);

  const purchasementHandler = (event) => {
    event.preventDefault();

    if (user && user !== 'public') {
      if (action === 'cart') {
        if (inCart) {
          const updatedCart = [...cart];
          const index = updatedCart.findIndex((item) => item.product.id === product.id);

          updatedCart[index].qty = qty;
          updateCart(updatedCart);

          showAside(0);
        } else {
          asyncWaiter(async () => await addToCart({ qty, product }), true, 'Product added to cart');
        }
      } else if (action === 'buy') {
        router.push(`/checkout?product=${product.id}&qty=${qty}`, undefined, { shallow: true });
      }
    } else {
      showModal(<Auth />);
    }
  };

  return (
    <div className={styles.purchasement}>
      {product.stock ? (
        <form onSubmit={purchasementHandler}>
          <select
            name="qty"
            id="qty"
            value={qty}
            className="btn"
            onChange={(event) => setQty(Number(event.target.value))}
          >
            {[...Array(maxQty).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>

          <button
            type="submit"
            value="buy"
            onClick={(event) => setAction(event.currentTarget.value)}
            className={`${styles.buy} btn btn-primary`}
          >
            <span className="text-ellipsis ellipsis-1">Buy Now</span>
          </button>
          <button
            type="submit"
            value="cart"
            onClick={(event) => setAction(event.currentTarget.value)}
            className="btn btn-primary"
          >
            {inCart ? (
              <>
                <span className="inline-icon">
                  <CartInIcon />
                </span>
                <span>In Cart</span>
              </>
            ) : (
              <>
                <span className="inline-icon">
                  <CartAddIcon />
                </span>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="btn danger">Product is Not Available</div>
      )}
    </div>
  );
}
