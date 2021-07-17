import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import ProductsRating from '../components/Products/ProductsRating';

import styles from '../styles/Home.module.css';

import { getImageUrl } from '../utils/urls';
import optimizePrice from '../utils/optimizePrice';

export default function Home({ products }) {
  return (
    <div className="content">
      <Head>
        <title>Genz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Top Products</h1>
      <div className={styles.productsContainer}>
        <ul className={styles.products}>
          {products.map((product) => (
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

export async function getStaticProps() {
  const { data: products } = await axios.get('/products', { params: { _sort: 'stock:DESC,rate:DESC,rater:DESC' } });

  return {
    props: {
      products,
    },
  };
}
