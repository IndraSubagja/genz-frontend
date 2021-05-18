import { useContext, useEffect } from 'react';
import Head from 'next/head';
// import Link from 'next/link';
import axios from 'axios';

import ProductRating from '../../components/Product/ProductRating';
import ProductSections from '../../components/Product/ProductSections';
import ProductImages from '../../components/Product/ProductImages';
import ProductPurchasement from '../../components/Product/ProductPurchasement';

import AsideContext from '../../context/AsideContext';
import ModalContext from '../../context/ModalContext';

import styles from '../../styles/Product.module.css';

import { API_URL } from '../../utils/urls';
import sortImages from '../../utils/sortImages';
import optimizePrice from '../../utils/optimizePrice';

export default function Product({ product, error }) {
  const { hideAside } = useContext(AsideContext);
  const { hideModal } = useContext(ModalContext);

  useEffect(() => {
    hideAside();
    hideModal();
  }, []);

  return (
    <div className="content">
      <Head>
        <title>{product.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {error ? (
        <h1 className="error"></h1>
      ) : (
        <>
          <div className={styles.productContainer}>
            <div className={styles.images}>
              <ProductImages product={product} />
            </div>

            <div className={styles.details}>
              <h1 className={styles.title}>{product.title}</h1>
              <ProductRating product={product} />
              <h3 className="price">{optimizePrice(product.price)}</h3>
              <ProductPurchasement product={product} />
              <ProductSections product={product} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const { data: products } = await axios.get(`${API_URL}/products`);

  return {
    paths: products.map((product) => ({
      params: {
        id: String(product.id),
      },
    })),

    fallback: false,
  };
}

export async function getStaticProps({ params: { id } }) {
  try {
    const { data: product } = await axios.get(`${API_URL}/products/${id}`);

    sortImages(product);

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    return {
      props: {
        error: message,
      },
    };
  }
}
