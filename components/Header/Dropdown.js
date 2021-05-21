import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';

import AsideContext from '../../context/AsideContext';
import ModalContext from '../../context/ModalContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Header.module.css';

import { compareCartData } from '../../utils/compareData';
import { CogIcon, LogoutIcon, UserIcon } from '../../utils/icons';
import Warning from '../Modal/Warning';

export default function Dropdown({ dropdown, setDropdown }) {
  const [pos, setPos] = useState(null);

  const { user, userLogout } = useContext(UserContext);
  const { cart, dropCart } = useContext(AsideContext);
  const { showModal } = useContext(ModalContext);

  const dataset = [
    {
      title: 'Profile',
      href: '/profile',
      icon: <UserIcon />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <CogIcon />,
    },
  ];

  const dropdownTransition = useTransition(dropdown, {
    from: { transform: 'translateY(-120%)' },
    enter: { transform: 'translateY(0%)' },
    leave: { transform: 'translateY(-120%)' },
    config: {
      duration: 200,
    },
  });

  const logoutHandler = () => {
    if (compareCartData(cart, user.cart)) {
      userLogout();
      dropCart();
      setDropdown(false);
    } else {
      showModal(<Warning />, 0);
      setDropdown(false);
    }
  };

  useEffect(() => {
    if (dropdown) {
      const optimizeDropdown = () => {
        const accountDropdown = document.getElementById('accountDropdown');
        const left = accountDropdown?.getBoundingClientRect().left - 160;

        setPos(left);
      };

      optimizeDropdown();

      window.addEventListener('resize', optimizeDropdown);

      return () => window.removeEventListener('resize', optimizeDropdown);
    }
  }, [dropdown]);

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

          <div className={styles.dropdownOverlay} onClick={() => setDropdown(false)}>
            <animated.ul className={styles.dropdown} onClick={(event) => event.stopPropagation()} style={transition}>
              {dataset.map((data) => (
                <li key={data.title}>
                  <Link href={data.href}>
                    <a>
                      <span className="inlineIcon">{data.icon}</span>
                      <span>{data.title}</span>
                    </a>
                  </Link>
                </li>
              ))}

              <li>
                <a onClick={logoutHandler}>
                  <span className="inlineIcon">
                    <LogoutIcon />
                  </span>
                  <span>Logout</span>
                </a>
              </li>
            </animated.ul>
          </div>
        </>
      )
  );
}
