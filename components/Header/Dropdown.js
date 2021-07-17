import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { animated, useTransition } from 'react-spring';
import FocusTrap from 'focus-trap-react';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';
import CartContext from '../../context/User/CartContext';
import WishlistContext from '../../context/User/WishlistContext';

import styles from '../../styles/Header.module.css';

import { CartIcon, CogIcon, LogoutIcon, LoveIcon, UserIcon } from '../../utils/icons';

export default function Dropdown({ dropdown, setDropdown }) {
  const router = useRouter();

  const [pos, setPos] = useState(null);

  const {
    modal: { hideModal },
    aside: { showAside },
    notification: { showNotification },
    loading: { hideLoading },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { user, userLogout } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);
  const { clearWishlist } = useContext(WishlistContext);

  const dropdownTransition = useTransition(dropdown, {
    from: { transform: 'translateY(-120%)' },
    enter: { transform: 'translateY(0%)' },
    leave: { transform: 'translateY(-120%)' },
    config: {
      duration: 200,
    },
  });

  const hideDropdown = useCallback(() => setDropdown(false), [setDropdown]);

  const optimizeHideDropdown = (event) => {
    if (event.button === 0 || event.key === 'Escape') {
      const target = event.target;

      const activate = (event) => {
        if (target === event.target) {
          hideDropdown();
        }
      };

      target.addEventListener('mouseup', activate, { once: true });
    }
  };

  const logoutHandler = () =>
    asyncWaiter(async () => {
      await userLogout();

      localStorage.setItem('auth', 'logout');

      clearCart();
      clearWishlist();

      hideModal();
      hideDropdown();

      showNotification(true, `See you again, ${user.name.split(' ')[0]}!`);

      if (!['/[userid]', '/orders/[id]', '/checkout'].some((pathname) => router.pathname.includes(pathname))) {
        hideLoading();
      }
    });

  useEffect(() => {
    if (user && user !== 'public') {
      const optimizeDropdown = () => {
        const accountDropdown = document.getElementById('accountDropdown');
        const left = accountDropdown.getBoundingClientRect().left - 160;

        setPos(left);
      };

      optimizeDropdown();

      window.addEventListener('resize', optimizeDropdown);
      router.events.on('routeChangeStart', hideDropdown);

      return () => {
        window.removeEventListener('resize', optimizeDropdown);
        router.events.off('routeChangeStart', hideDropdown);
      };
    }
  }, [user, dropdown, router.events, hideDropdown]);

  return dropdownTransition(
    (transition, item) =>
      item && (
        <>
          <style jsx global>
            {`
              .${styles.dropdown} {
                left: ${pos}px;
              }
            `}
          </style>

          <FocusTrap>
            <div
              className={styles.dropdownOverlay}
              onMouseDown={(event) => optimizeHideDropdown(event)}
              onKeyDown={(event) => (event.key === 'Escape' ? hideDropdown() : null)}
            >
              <animated.ul
                className={styles.dropdown}
                onMouseDown={(event) => event.stopPropagation()}
                style={transition}
              >
                <li>
                  <Link href={`/${user?.id}`}>
                    <a>
                      <span className="inline-icon">
                        <UserIcon />
                      </span>
                      <span>Profile</span>
                    </a>
                  </Link>
                </li>

                {matchMedia('(max-width:575px)').matches && (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          hideDropdown();
                          showAside(0);
                        }}
                      >
                        <span className="inline-icon">
                          <CartIcon />
                        </span>
                        <span>Cart</span>
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          hideDropdown();
                          showAside(1);
                        }}
                      >
                        <span className="inline-icon">
                          <LoveIcon />
                        </span>
                        <span>Wishlist</span>
                      </button>
                    </li>
                  </>
                )}

                <li>
                  <Link href="/settings">
                    <a>
                      <span className="inline-icon">
                        <CogIcon />
                      </span>
                      <span>Settings</span>
                    </a>
                  </Link>
                </li>

                <li>
                  <button type="button" onClick={logoutHandler}>
                    <span className="inline-icon">
                      <LogoutIcon />
                    </span>
                    <span>Logout</span>
                  </button>
                </li>
              </animated.ul>
            </div>
          </FocusTrap>
        </>
      )
  );
}
