import { useContext } from 'react';

import Cart from './Aside/Cart';
import Wishlist from './Aside/Wishlist';

import AsideContext from '../context/AsideContext';
import UserContext from '../context/UserContext';

import styles from '../styles/Aside.module.css';

import { CrossIcon } from '../utils/icons';

export default function Aside() {
  const { user } = useContext(UserContext);
  const { aside, active, setActive, optimizeHideAside } = useContext(AsideContext);

  return (
    user && (
      <>
        <style jsx>
          {`
            .${styles.sectionsSlider} {
              transform: translateX(${active * 100}%);
            }
            .${styles.sectionsBody} > li {
              transform: translateX(${active * -100}%);
            }
          `}
        </style>

        <div
          className={aside ? `${styles.asideOverlay} ${styles.visible}` : styles.asideOverlay}
          onMouseDown={optimizeHideAside}
        >
          <aside className={styles.asideContainer} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="close" onMouseDown={optimizeHideAside}>
              <CrossIcon />
            </button>

            <div className={styles.sections}>
              <div className={styles.sectionsHeader}>
                <a onClick={() => setActive(0)} className={active === 0 ? styles.active : ''}>
                  <h2>Cart</h2>
                </a>
                <a onClick={() => setActive(1)} className={active === 1 ? styles.active : ''}>
                  <h2>Wishlist</h2>
                </a>
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
          </aside>
        </div>
      </>
    )
  );
}
