import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

import PayPalButton from '../../components/Order/PaymentMethod/PayPalButton';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Order.module.css';

import { OrderIcon } from '../../utils/icons';
import { getImageUrl } from '../../utils/urls';
import optimizePrice from '../../utils/optimizePrice';
import { getDateTime } from '../../utils/optimizeTime';

export default function Order({ order }) {
  const router = useRouter();
  const [log, setLog] = useState(order.log);

  const {
    notification: { showNotification },
    asyncWaiter,
    showError,
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { cancelOrder } = useContext(UserContext);

  const cancelHandler = () =>
    asyncWaiter(
      async () => {
        await cancelOrder(order.id);
        showNotification(true, 'Order canceled');
      },
      false,
      '',
      (error) => {
        showError(error, false);
        router.push('/', undefined, { shallow: true });
      }
    );

  useEffect(() => {
    if (user && (user === 'public' || !user.orders.find((item) => item.id === order.id))) {
      router.push('/', undefined, { shallow: true });
    }
  }, [user, router, order]);

  return (
    order && (
      <div className="content">
        <Head>
          <title>Order {order.id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {user && user !== 'public' && (
          <div className={styles.orderContainer}>
            <h1 className={styles.title}>
              <span className="inline-icon">
                <OrderIcon />
              </span>
              <span>Order</span>
            </h1>

            <h3>ID: {order.id}</h3>

            <section>
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
                    {order?.items.map((item) => (
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

              <div>
                <div className={styles.orderLog}>
                  <h2>Order Log</h2>

                  <ul>
                    {log
                      .sort((a, b) => b.time.localeCompare(a.time))
                      .map((item) => (
                        <li key={item.message}>{`${item.message} at ${getDateTime(item.time)}`}</li>
                      ))}
                  </ul>
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

                  {!log.find((item) => item.message === 'Paid') && (
                    <>
                      {/* <button type="button" className="btn btn-block btn-primary">
                        Pay Now
                      </button> */}
                      <PayPalButton order={order} setLog={setLog} />
                    </>
                  )}

                  <button
                    type="button"
                    className="btn btn-block btn-danger"
                    onClick={cancelHandler}
                    disabled={log.find((item) => item.message === 'Paid')}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    )
  );
}

export async function getServerSideProps({ req, params: { id } }) {
  const token = req.cookies.token;

  if (token) {
    try {
      const { data } = await axios.get(`/orders/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (data.id === id) {
        return {
          props: {
            order: data,
          },
        };
      }
    } catch (error) {
      console.log(error?.response.status);
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}
