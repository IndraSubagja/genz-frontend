import { useContext, useEffect } from 'react';
import Head from 'next/head';
// import Link from 'next/link';
import axios from 'axios';

import ProductRating from '../../components/Products/Product/ProductRating';
import ProductSections from '../../components/Products/Product/ProductSections';
import ProductImages from '../../components/Products/Product/ProductImages';
import ProductPurchasement from '../../components/Products/Product/ProductPurchasement';
import Auth from '../../components/Modal/Auth';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';
import WishlistContext from '../../context/User/WishlistContext';
import RatingsContext from '../../context/User/RatingsContext';

import styles from '../../styles/Product.module.css';

import sortImages from '../../utils/sortImages';
import optimizePrice from '../../utils/optimizePrice';
import { LoveIcon, LoveOutlineIcon } from '../../utils/icons';

export default function Product({ product }) {
  const {
    modal: { showModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { getRating } = useContext(RatingsContext);

  const inWishlist = wishlist.find((item) => item.product.id === product.id);

  const wishlistHandler = () => {
    if (user && user !== 'public') {
      if (inWishlist) {
        asyncWaiter(async () => await removeFromWishlist(product, true), true, 'Product removed from wishlist');
      } else {
        asyncWaiter(async () => await addToWishlist({ product }), true, 'Product added to wishlist');
      }
    } else {
      showModal(<Auth />);
    }
  };

  useEffect(() => {
    getRating(product.id);
  }, [getRating, product]);

  return (
    <div className="content">
      <Head>
        <title>{product.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.productContainer}>
        <div className={styles.images}>
          <ProductImages product={product} />
        </div>

        <div className={styles.details}>
          <div>
            <h1 className={styles.title}>{product.title}</h1>
            <button type="button" onClick={wishlistHandler}>
              {inWishlist ? <LoveIcon /> : <LoveOutlineIcon />}
            </button>
          </div>
          <ProductRating product={product} />
          <h3 className="price">{optimizePrice(product.price)}</h3>
          <ProductPurchasement product={product} />
          <ProductSections product={product} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data: products } = await axios.get('/products');

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
  const { data: product } = await axios.get(`/products/${id}`);

  sortImages(product);

  return {
    props: {
      product,
    },
  };
}
