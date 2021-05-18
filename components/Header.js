import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import Dropdown from './Header/Dropdown';

import AsideContext from '../context/AsideContext';
import ModalContext from '../context/ModalContext';
import UserContext from '../context/UserContext';

import styles from '../styles/Header.module.css';

import { ArrowBottomIcon, CartIcon, LoginIcon, LoveIcon, SearchIcon } from '../utils/icons';

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [pos, setPos] = useState(null);
  const [logo, setLogo] = useState('/logo.svg');

  const { user } = useContext(UserContext);
  const { showAside } = useContext(AsideContext);
  const { showModal } = useContext(ModalContext);

  useEffect(() => {
    const responsiveLogo = () =>
      matchMedia('(max-width:576px)').matches ? setLogo('/icon.svg') : setLogo('/logo.svg');

    const optimizeDropdown = () => {
      const accountDropdown = document.getElementById('accountDropdown');
      const left = accountDropdown?.getBoundingClientRect().left - 160;

      setPos(left);
    };

    responsiveLogo();
    optimizeDropdown();

    window.addEventListener('resize', responsiveLogo);
    window.addEventListener('resize', optimizeDropdown);

    return () => {
      window.removeEventListener('resize', responsiveLogo);
      window.removeEventListener('resize', optimizeDropdown);
    };
  }, [user]);

  return (
    <>
      <style jsx global>
        {`
          .${styles.dropdown} {
            left: ${pos}px;
          }
        `}
      </style>

      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <Link href="/">
            <a>
              <img src={logo} alt="GENZ" className={styles.logo} />
            </a>
          </Link>

          <form className={styles.search}>
            <input type="text" name="search" id="search" placeholder="Search...." />
            <Link href="/search">
              <button type="submit" className="btn-primary">
                <SearchIcon />
              </button>
            </Link>
          </form>

          {!user ? (
            <div className={styles.login}>
              <button className="btn btn-primary" onClick={() => showModal(0)}>
                <span className="inlineIcon">
                  <LoginIcon />
                </span>
                <span>Login</span>
              </button>
            </div>
          ) : (
            <>
              <nav className={styles.nav}>
                <a onClick={() => showAside(0)}>
                  {!!user.cart.length && (
                    <div className={styles.badge}>{user.cart.length > 99 ? `99+` : user.cart.length}</div>
                  )}
                  <CartIcon />
                </a>

                <a onClick={() => showAside(1)}>
                  <LoveIcon />
                </a>
              </nav>

              <div className={styles.profile}>
                <Link href="/user">
                  <a className={styles.avatar}>
                    <img src="/icons/user.svg" alt="Avatar" />
                  </a>
                </Link>

                <a id="accountDropdown" onClick={() => setDropdown(true)}>
                  <ArrowBottomIcon />
                </a>
              </div>
            </>
          )}

          {user && <Dropdown visible={dropdown} onClick={() => setDropdown(false)} />}
        </header>
      </div>
    </>
  );
}
