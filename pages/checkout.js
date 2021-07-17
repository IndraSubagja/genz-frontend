import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import CheckoutSections from '../components/Checkout/CheckoutSections';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';

import GeneralContext from '../context/GeneralContext';
import UserContext from '../context/UserContext';
import CartContext from '../context/User/CartContext';

import styles from '../styles/Checkout.module.css';

export default function Checkout({ item }) {
  const router = useRouter();

  const [step, setStep] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    loading: { showLoading, hideLoading },
  } = useContext(GeneralContext);
  const { user, updateUserData } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const successHandler = async () => {
      showLoading(0.8);

      await updateUserData({ cart: [] });

      localStorage.removeItem('tempOrder');
      localStorage.removeItem('orderShippingAddress');

      clearCart();
      hideLoading();
    };

    if (step) {
      sessionStorage.setItem('orderStep', step);
    } else if (sessionStorage.getItem('orderStep')) {
      setStep(sessionStorage.getItem('orderStep'));
    } else {
      setStep(2);
    }

    if (user && (user === 'public' || (!user.cart.length && !item && !success))) {
      router.push('/', undefined, { shallow: true });
    }

    return () => {
      if (success) {
        successHandler();
      }
      sessionStorage.removeItem('orderStep');
    };
  }, [user, router, step, success, clearCart, updateUserData, showLoading, hideLoading, item]);

  return (
    <div className="content">
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user && user !== 'public' && (
        <div className={styles.checkoutContainer}>
          <CheckoutSteps step={step} />
          <CheckoutSections user={user} step={step} setStep={setStep} setSuccess={setSuccess} item={item} />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const token = req.cookies.token;

  if (token) {
    try {
      const props = {};

      const { data } = await axios.get('/users/me', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      props.user = data;

      if (data.cart.length || query.product) {
        if (query.product) {
          const { data } = await axios.get(`products/${query.product}`);
          props.item = { product: data, qty: query.qty };
        }

        return { props };
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
