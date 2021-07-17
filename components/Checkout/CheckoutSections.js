import { useEffect, useState } from 'react';

import OrderDetails from './CheckoutSections/OrderDetails';
import PaymentMethod from './CheckoutSections/PaymentMethod';
import ShippingAddress from './CheckoutSections/ShippingAddress';

import styles from '../../styles/Checkout/CheckoutSections.module.css';

import { compareCartData } from '../../utils/compareData';

export default function CheckoutSections({ user, step, setStep, setSuccess, item }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!order || !compareCartData(order.items, item ? [item] : user.cart)) {
      const customAddress = localStorage.getItem('orderShippingAddress')
        ? JSON.parse(localStorage.getItem('orderShippingAddress'))
        : null;
      const shippingAddress = customAddress || user.shippingAddress?.[0];
      const itemsPrice = (item ? [item] : user.cart).reduce((a, b) => a + b.product.price * b.qty, 0);
      const shippingPrice = 1.49 * (item ? [item] : user.cart).length;
      const taxPrice = 0.99;
      const order = {
        items: item ? [{ ...item, id: 1 }] : user.cart,
        shippingAddress: shippingAddress
          ? {
              id: 0,
              recipientName: shippingAddress.recipientName,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2,
              city: shippingAddress.city,
              country: shippingAddress.country,
              postalCode: shippingAddress.postalCode,
              phoneNumber: shippingAddress.phoneNumber,
            }
          : null,
        paymentMethod: user.paymentMethod || 'PayPal',
        price: {
          itemsPrice,
          shippingPrice,
          taxPrice,
        },
      };

      setOrder(order);
      localStorage.setItem('tempOrder', JSON.stringify(order));
    } else if (order) {
      localStorage.setItem('tempOrder', JSON.stringify(order));
    } else if (localStorage.getItem('tempOrder')) {
      setOrder(JSON.parse(localStorage.getItem('tempOrder')));
    }
  }, [order, user, item]);

  return (
    <>
      <style jsx>
        {`
          .${styles.sectionsBody} > li {
            transform: translateX(${(step - 2) * -100}%);
          }
          .${styles.sectionsBody} > li:nth-child(-n + ${step - 2}),
          .${styles.sectionsBody} > li:nth-last-child(-n + ${2 - (step - 2)}) {
            visibility: hidden;
          }
        `}
      </style>

      <div className={styles.sections}>
        <ul className={styles.sectionsBody}>
          <li>
            <ShippingAddress user={user} order={order} setOrder={setOrder} setStep={setStep} />
          </li>
          <li>
            <PaymentMethod order={order} setOrder={setOrder} setStep={setStep} />
          </li>
          <li>
            <OrderDetails order={order} setSuccess={setSuccess} setStep={setStep} />
          </li>
        </ul>
      </div>
    </>
  );
}
