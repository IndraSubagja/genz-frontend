import Link from 'next/link';
import { useContext } from 'react';
import AsideContext from '../../context/AsideContext';

import UserContext from '../../context/UserContext';

import styles from '../../styles/Header.module.css';
import { CogIcon, LogoutIcon, UserIcon } from '../../utils/icons';

export default function Dropdown({ visible, onClick }) {
  const { userLogout } = useContext(UserContext);
  const { dropCart } = useContext(AsideContext);

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

  const logoutHandler = () => {
    userLogout();
    dropCart();
    onClick();
  };

  return (
    <div className={visible ? `${styles.dropdownOverlay} ${styles.visible}` : styles.dropdownOverlay} onClick={onClick}>
      <ul className={styles.dropdown} onClick={(event) => event.stopPropagation()}>
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
      </ul>
    </div>
  );
}
