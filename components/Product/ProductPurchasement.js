import { useContext, useState } from 'react';

import AsideContext from '../../context/AsideContext';
import ModalContext from '../../context/ModalContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Product/ProductPurchasement.module.css';

import { CartAddIcon } from '../../utils/icons';
import optimizePrice from '../../utils/optimizePrice';

export default function ProductPurchasement({ product }) {
  const [action, setAction] = useState(null);
  const [qty, setQty] = useState(1);

  const { user } = useContext(UserContext);
  const { cart, addToCart, showAside } = useContext(AsideContext);
  const { showModal } = useContext(ModalContext);

  product.stock = 8;
  const maxQty = product.stock > 9 ? 10 : product.stock;
  const inCart = cart?.some((item) => item.product.id === product.id);

  const purchasementHandler = async (event) => {
    event.preventDefault();

    if (action === 'cart') {
      if (user) {
        if (!inCart) {
          await addToCart({ qty, product });
        }
        showAside(0);
      } else {
        showModal(0);
      }
    }
  };

  return (
    <div className={styles.purchasement}>
      {product.isAvailable ? (
        <form onSubmit={purchasementHandler}>
          <select name="qty" id="qty" className="btn" onChange={(event) => setQty(Number(event.target.value))}>
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
            <span>{optimizePrice(product.price)}</span>
          </button>
          <button
            type="submit"
            value="cart"
            onClick={(event) => setAction(event.currentTarget.value)}
            className={`${styles.cart} btn btn-primary`}
          >
            {inCart ? (
              <span>In Cart</span>
            ) : (
              <>
                <span className="inlineIcon">
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
