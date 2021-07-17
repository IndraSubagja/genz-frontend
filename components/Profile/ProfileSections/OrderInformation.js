import Link from 'next/link';

import styles from '../../../styles/Profile/ProfileSections.module.css';

import optimizePrice from '../../../utils/optimizePrice';
import { getDateTime } from '../../../utils/optimizeTime';
import { getImageUrl } from '../../../utils/urls';

export default function OrderInformation({ user }) {
  return (
    <section className={styles.section}>
      {!user.orders.length ? (
        <p className="empty">There&apos;s no order.</p>
      ) : (
        <table className={styles.order}>
          <thead>
            <tr>
              <th>Items</th>
              <th>Total</th>
              <th>Ordered at</th>
              <th>Paid at</th>
              <th>Delivered at</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {user.orders.map((order) => {
              const { itemsPrice, shippingPrice, taxPrice } = order.price;
              const totalPrice = itemsPrice + shippingPrice + taxPrice;

              const isDelivered = order.log.find((item) => item.message === 'Delivered');
              const isOrdered = order.log.find((item) => item.message === 'Ordered');
              const isPaid = order.log.find((item) => item.message === 'Paid');

              return (
                <tr key={order.id}>
                  <td>
                    <ul className={styles.orderItems}>
                      {order.items.slice(0, 5).map((item) => (
                        <li key={item.id}>
                          <img src={getImageUrl(item.product.images[0].url)} alt={item.product.title} />
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <p>{optimizePrice(totalPrice)}</p>
                  </td>
                  <td>
                    <p>{isOrdered ? getDateTime(isOrdered.time) : '-'}</p>
                  </td>
                  <td>
                    <p>{isPaid ? getDateTime(isPaid.time) : '-'}</p>
                  </td>
                  <td>
                    <p>{isDelivered ? getDateTime(isDelivered.time) : '-'}</p>
                  </td>
                  <td>
                    <Link href={`/orders/${order.id}`}>
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
