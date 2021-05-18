import { useContext, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import ProductRating from '../components/Product/ProductRating';

import AsideContext from '../context/AsideContext';
import ModalContext from '../context/ModalContext';

import styles from '../styles/Home.module.css';

import { API_URL, imageUrl } from '../utils/urls';
import optimizePrice from '../utils/optimizePrice';
import sortImages from '../utils/sortImages';

export default function Home({ products, error }) {
  const { hideAside } = useContext(AsideContext);
  const { hideModal } = useContext(ModalContext);

  useEffect(() => {
    hideAside();
    hideModal();
  }, []);

  return (
    <div className="content">
      <Head>
        <title>Genz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {error ? (
        <h1 className="error">{error}</h1>
      ) : (
        <>
          <h1 className={styles.title}>Top Products</h1>
          <div className={styles.productsContainer}>
            <ul className={styles.products}>
              {products.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.id}`}>
                    <a className={styles.product}>
                      <img src={imageUrl(product.images[0].url)} alt={product.title} />

                      <div>
                        <ProductRating product={product} />
                        <h2>{product.title}</h2>
                        <h3 className="price">{optimizePrice(product.price)}</h3>
                      </div>

                      {!product.isAvailable && (
                        <div className={`${styles.unavailable} danger`}>
                          <span>Out of Stock</span>
                        </div>
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data: products } = await axios.get(`${API_URL}/products`);

    products.map((product) => sortImages(product));

    return {
      props: {
        products,
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
