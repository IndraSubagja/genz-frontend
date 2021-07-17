import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import qs from 'qs';

import Dropdown from './Header/Dropdown';
import Auth from './Modal/Auth';

import GeneralContext from '../context/GeneralContext';
import UserContext from '../context/UserContext';

import styles from '../styles/Header.module.css';

import { CartIcon, DropdownIcon, EqualizerIcon, LoginIcon, LoveIcon, SearchIcon } from '../utils/icons';
import { getImageUrl } from '../utils/urls';
import AdvanceSearch from './Modal/AdvanceSearch';

export default function Header() {
  const router = useRouter();

  const [dropdown, setDropdown] = useState(false);
  const [logo, setLogo] = useState('/logo.svg');
  const [search, setSearch] = useState(null);

  const {
    modal: { showModal },
    aside: { showAside },
  } = useContext(GeneralContext);
  const { user } = useContext(UserContext);

  const searchHandler = async (event) => {
    event.preventDefault();

    const query = JSON.parse(localStorage.getItem('query')) || { _sort: 'title:ASC' };

    if (search) {
      query._q = search;
      localStorage.setItem('search', JSON.stringify(search));
    }

    router.push(`/search?${qs.stringify({ ...query })}`);
  };

  useEffect(() => {
    const responsiveLogo = () =>
      matchMedia('(max-width:575px)').matches ? setLogo('/icon.svg') : setLogo('/logo.svg');

    responsiveLogo();

    window.addEventListener('resize', responsiveLogo);

    return () => window.removeEventListener('resize', responsiveLogo);
  }, []);

  useEffect(() => {
    if (search === null) {
      setSearch(JSON.parse(localStorage.getItem('search')));
    } else {
      localStorage.setItem('search', JSON.stringify(search));
    }
  }, [search, router]);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.header}>
        <Link href="/">
          <a>
            <img src={logo} alt="GENZ" className={styles.logo} />
          </a>
        </Link>

        <form className={styles.search} onSubmit={searchHandler}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search...."
            value={search || ''}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" onClick={() => showModal(<AdvanceSearch />)}>
            <EqualizerIcon />
          </button>
          <button type="submit" className="btn-danger">
            <SearchIcon />
          </button>
        </form>

        {!user || user === 'public' ? (
          <div className={styles.login}>
            <button type="button" className="btn btn-primary" onClick={() => showModal(<Auth />)}>
              <span className="inline-icon">
                <LoginIcon />
              </span>
              <span>Login</span>
            </button>
          </div>
        ) : (
          <>
            <nav className={styles.nav}>
              <button type="button" onClick={() => showAside(0)}>
                {!!user.cart.length && (
                  <div className={styles.badge}>
                    <span>{user.cart.length > 99 ? '99+' : user.cart.length}</span>
                  </div>
                )}
                <CartIcon />
              </button>

              <button type="button" onClick={() => showAside(1)}>
                <LoveIcon />
              </button>
            </nav>

            <div className={styles.profile}>
              <Link href={`/${user.id}`}>
                <a className={styles.avatar}>
                  {user.avatar ? (
                    <img src={getImageUrl(user.avatar.url)} alt="Avatar" />
                  ) : (
                    <>
                      <span>{user.name.split(' ').map((item) => item[0].toUpperCase())}</span>
                      <img src="data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                    </>
                  )}
                </a>
              </Link>

              <button type="button" id="accountDropdown" onClick={() => setDropdown(true)}>
                <DropdownIcon />
              </button>
            </div>
          </>
        )}

        <Dropdown dropdown={dropdown} setDropdown={setDropdown} />
      </div>
    </header>
  );
}
