import { useContext } from 'react';
import { useTransition, animated } from 'react-spring';

import Cart from './Aside/Cart';
import Wishlist from './Aside/Wishlist';

import AsideContext from '../context/AsideContext';

import styles from '../styles/Aside.module.css';

import { CrossIcon } from '../utils/icons';

export default function Aside() {
  const {
    aside: { state, active },
    changeActive,
    optimizeHideAside,
  } = useContext(AsideContext);

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
        `}
      </style>

      {overlayTransition(
        (transition, item) =>
          item && (
            <animated.div className={styles.asideOverlay} style={transition} onMouseDown={optimizeHideAside}>
              {asideTransition(
                (transition, item) =>
                  item && (
                    <animated.aside
                      className={styles.asideContainer}
                      style={transition}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <button type="button" className="close" onMouseDown={optimizeHideAside}>
                        <CrossIcon />
                      </button>

                      <div className={styles.sections}>
                        <div className={styles.sectionsHeader}>
                          <a onClick={() => changeActive(0)} className={active === 0 ? styles.active : ''}>
                            <h2>Cart</h2>
                          </a>
                          <a onClick={() => changeActive(1)} className={active === 1 ? styles.active : ''}>
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
                    </animated.aside>
                  )
              )}
            </animated.div>
          )
      )}
    </>
  );
}
