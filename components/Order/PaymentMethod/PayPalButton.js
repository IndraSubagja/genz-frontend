import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import GeneralContext from '../../../context/GeneralContext';

import UserContext from '../../../context/UserContext';

export default function PayPalButton({ order, setLog }) {
  const [sdkReady, setSdkReady] = useState(false);

  const PayPalButton = sdkReady ? window.paypal.Buttons.driver('react', { React, ReactDOM }) : null;

  const { asyncWaiter } = useContext(GeneralContext);
  const { updateOrder } = useContext(UserContext);

  useEffect(() => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const addPaypalScript = async () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }

    return () => localStorage.removeItem('__paypal_storage__');
  }, []);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          reference_id: order.id,
          amount: {
            currency_code: 'USD',
            value: Number((order.price.itemsPrice + order.price.shippingPrice + order.price.taxPrice).toFixed(2)),
            breakdown: {
              item_total: { currency_code: 'USD', value: Number(order.price.itemsPrice.toFixed(2)) },
              shipping: { currency_code: 'USD', value: Number(order.price.shippingPrice.toFixed(2)) },
              tax_total: { currency_code: 'USD', value: Number(order.price.taxPrice.toFixed(2)) },
            },
          },
          items: order.items.map((item) => ({
            name: item.product.title,
            unit_amount: {
              currency_code: 'USD',
              value: Number(item.product.price.toFixed(2)),
            },
            quantity: item.qty,
          })),
          shipping: {
            name: {
              full_name: order.shippingAddress.recipientName,
            },
            address: {
              address_line_1: order.shippingAddress.addressLine1,
              address_line_2: order.shippingAddress.addressLine2,
              admin_area_1: order.shippingAddress.country,
              admin_area_2: order.shippingAddress.city,
              postal_code: order.shippingAddress.postalCode,
              country_code: 'GB',
            },
          },
        },
      ],
      application_context: {
        brand_name: 'GENZ',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
      },
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      if (details.status === 'COMPLETED') {
        const log = [
          ...order.log.map((item) => ({ message: item.message, time: item.time })),
          { message: 'Paid', time: details.update_time },
        ];

        asyncWaiter(
          async () => {
            await updateOrder(order.id, log);
            setLog(log);
          },
          true,
          'Payment succeed'
        );
      }
    });
  };

  return (
    sdkReady && (
      <PayPalButton
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    )
  );
}
