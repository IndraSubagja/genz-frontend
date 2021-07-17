import { useCallback, useContext, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import { useRouter } from 'next/router';
import FocusTrap from 'focus-trap-react';

import Cart from './Aside/Cart';
import Wishlist from './Aside/Wishlist';

import GeneralContext from '../context/GeneralContext';
import UserContext from '../context/UserContext';
import CartContext from '../context/User/CartContext';
import WishlistContext from '../context/User/WishlistContext';

import styles from '../styles/Aside.module.css';

import { CrossIcon } from '../utils/icons';
import { compareCartData, compareWishlistData } from '../utils/compareData';

export default function Aside() {
  const router = useRouter();

  const {
    aside: {
      aside: { state, active },
      changeAside,
      hideAside,
      optimizeHideAside,
    },
    notification: { showNotification },
  } = useContext(GeneralContext);
  const { user, getUser, updateUserData } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const overlayTransition = useTransition(state, {
    from: {
      backgroundColor: 'transparent',
    },
    enter: {
      backgroundColor: 'hsla(44, 100%, 50%, 0.4)',
    },
    leave: {
      backgroundColor: 'transparent',
    },
    config: {
      duration: 200,
    },
  });

  const asideTransition = useTransition(state, {
    from: {
      transform: 'translateX(100%)',
    },
    enter: {
      transform: 'translateX(0%)',
    },
    leave: {
      transform: 'translateX(100%)',
    },
    config: {
      duration: 200,
    },
  });

  const saveHandler = useCallback(() => {
    if (!compareCartData(cart, user.cart)) {
      updateUserData({ cart });
    }
    if (!compareWishlistData(wishlist, user.wishlist)) {
      updateUserData({ wishlist });
    }
  }, [user, cart, wishlist, updateUserData]);

  const closeHandler = () => {
    if (!compareCartData(cart, user.cart) || !compareWishlistData(wishlist, user.wishlist)) saveHandler();
  };

  useEffect(() => {
    if (user && user !== 'public') {
      const changeRouteHandler = () => {
        if (!compareCartData(cart, user.cart) || !compareWishlistData(wishlist, user.wishlist)) {
          saveHandler();
        }

        hideAside();
      };

      const autoSave = () => {
        if (document.visibilityState === 'hidden') {
          const formData = new FormData();
          formData.append('cart', JSON.stringify(cart));
          formData.append('wishlist', JSON.stringify(wishlist));

          navigator.sendBeacon('http://localhost:1337/auto-save', formData);
        } else if (document.visibilityState === 'visible') {
          getUser();
        }
      };

      const navigationHandler = () => {
        getUser();
      };

      window.addEventListener('load', navigationHandler);
      window.addEventListener('visibilitychange', autoSave);
      router.events.on('routeChangeStart', changeRouteHandler);

      return () => {
        window.removeEventListener('load', navigationHandler);
        window.removeEventListener('visibilitychange', autoSave);
        router.events.off('routeChangeStart', changeRouteHandler);
      };
    }
  }, [user, cart, wishlist, hideAside, showNotification, router.events, saveHandler, getUser]);

  return (
    <>
      <style jsx>
        {`
          .${styles.sectionsSlider} {
            transform: translateX(${active * 100}%);
          }
          .${styles.sectionsBody} > li {
            transform: translateX(${active * -100}%);
          }
          .${styles.sectionsBody} > li:nth-child(-n + ${active}),
          .${styles.sectionsBody} > li:nth-last-child(-n + ${1 - active}) {
            visibility: hidden;
          }
        `}
      </style>

      {overlayTransition(
        (transition, item) =>
          item && (
            <FocusTrap>
              <animated.div
                className={styles.asideOverlay}
                style={transition}
                onMouseDown={(event) => optimizeHideAside(event, closeHandler)}
                onKeyDown={(event) => (event.key === 'Escape' ? hideAside() : null)}
              >
                {asideTransition(
                  (transition, item) =>
                    item && (
                      <animated.aside
                        className={styles.asideContainer}
                        style={transition}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="close"
                          onMouseDown={(event) => optimizeHideAside(event, closeHandler)}
                        >
                          <CrossIcon />
                        </button>

                        <div className={styles.sections}>
                          <div className={styles.sectionsHeader}>
                            <button
                              type="button"
                              onClick={() => changeAside(0)}
                              className={active === 0 ? styles.active : ''}
                            >
                              <h2>Cart</h2>
                            </button>
                            <button
                              type="button"
                              onClick={() => changeAside(1)}
                              className={active === 1 ? styles.active : ''}
                            >
                              <h2>Wishlist</h2>
                            </button>
                            <div className={styles.sectionsSlider}></div>
                          </div>

                          <ul className={styles.sectionsBody}>
                            <li>
                              <Cart />
                            </li>
                            <li>
                              <Wishlist />
                            </li>
                          </ul>
                        </div>
                      </animated.aside>
                    )
                )}
              </animated.div>
            </FocusTrap>
          )
      )}
    </>
  );
}
