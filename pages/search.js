import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import ProductsRating from '../components/Products/ProductsRating';

import styles from '../styles/Home.module.css';

import { getImageUrl } from '../utils/urls';
import optimizePrice from '../utils/optimizePrice';

export default function Search({ result }) {
  return (
    <div className="content">
      <Head>
        <title>Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>{!result.length ? 'No product found' : `${result.length} products found`}</h1>
      <div className={styles.productsContainer}>
        <ul className={styles.products}>
          {result.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                <a className={styles.product}>
                  <img src={getImageUrl(product.images[0].url)} alt={product.title} />

                  <div>
                    <ProductsRating product={product} />
                    <h2 className="text-ellipsis ellipsis-2">{product.title}</h2>
                    <h3 className="price">{optimizePrice(product.price)}</h3>
                  </div>

                  {!product.stock && (
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
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { data: result } = await axios.get('/products', { params: query });

  return {
    props: {
      result,
    },
  };
}
