import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import GeneralContext from '../../../context/GeneralContext';
import UserContext from '../../../context/UserContext';

import styles from '../../../styles/Checkout/CheckoutSections.module.css';

import { ArrowLeftIcon } from '../../../utils/icons';
import optimizePrice from '../../../utils/optimizePrice';
import { getImageUrl } from '../../../utils/urls';

export default function OrderDetails({ setSuccess, order, setStep }) {
  const router = useRouter();

  const {
    notification: { showNotification },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { createOrder } = useContext(UserContext);

  const submitHandler = () =>
    asyncWaiter(async () => {
      const data = await createOrder({
        ...order,
        items: order.items.map((item) => ({ product: item.product.id, qty: item.qty })),
        shippingAddress: {
          recipientName: order.shippingAddress.recipientName,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2,
          city: order.shippingAddress.city,
          country: order.shippingAddress.country,
          postalCode: order.shippingAddress.postalCode,
          phoneNumber: order.shippingAddress.phoneNumber,
        },
        log: [{ message: 'Ordered', time: new Date().toISOString() }],
      });

      setSuccess(true);
      showNotification(true, 'Order created');

      router.push(`/orders/${data.id}`, undefined, { shallow: true });
    });

  return (
    <>
      <h1 className={styles.title}>
        <button type="button" className="inline-icon" onClick={() => setStep(3)}>
          <ArrowLeftIcon />
        </button>
        <span>Order Details</span>
      </h1>

      <section className={`${styles.section} ${styles.orderContainer}`}>
        {order && (
          <>
            <div className={styles.orderDetails}>
              <table>
                <tbody>
                  <tr>
                    <th>Shipping Address</th>
                    <td colSpan="3">
                      <p>{order?.shippingAddress?.recipientName}</p>
                      <p>{order?.shippingAddress?.addressLine1}</p>
                      <p>{order?.shippingAddress?.addressLine2}</p>
                      <p>{`${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}`}</p>
                      <p>{order?.shippingAddress?.postalCode}</p>
                      <p>{order?.shippingAddress?.phoneNumber}</p>
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Method</th>
                    <td colSpan="3">{order?.paymentMethod}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <img src={getImageUrl(item.product.images[0].url)} alt={item.product.title} />
                          <Link href={`/products/${item.product.id}`}>
                            <a>
                              <p>{item.product.title}</p>
                            </a>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <p>{optimizePrice(item.product.price)}</p>
                      </td>
                      <td>
                        <p>{item.qty}</p>
                      </td>
                      <td>
                        <p>{optimizePrice(item.product.price * item.qty)}</p>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <th>Total</th>
                    <td colSpan="3">{optimizePrice(order.price.itemsPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.orderSummary}>
              <h2>Order Summary</h2>

              <div>
                <p>
                  <span>Items Price</span>
                  <span>{optimizePrice(order.price.itemsPrice)}</span>
                </p>
                <p>
                  <span>Shipping Price</span>
                  <span>{optimizePrice(order.price.shippingPrice)}</span>
                </p>
                <p>
                  <span>Tax Price</span>
                  <span>{optimizePrice(order.price.taxPrice)}</span>
                </p>
                <p>
                  <span>
                    <strong>Total</strong>
                  </span>
                  <span>
                    <strong>
                      {optimizePrice(order.price.itemsPrice + order.price.shippingPrice + order.price.taxPrice)}
                    </strong>
                  </span>
                </p>
              </div>

              <button type="button" className="btn btn-block btn-primary" onClick={submitHandler}>
                Create Order
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
