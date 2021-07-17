import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import ProfileAvatar from '../components/Profile/ProfileAvatar';
import ProfileSections from '../components/Profile/ProfileSections';

import UserContext from '../context/UserContext';

import styles from '../styles/Profile.module.css';

import { UserIcon } from '../utils/icons';

export default function Profile() {
  const router = useRouter();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user === 'public') {
      router.push('/', undefined, { shallow: true });
    }
  }, [user, router]);

  return (
    <div className="content">
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user && user !== 'public' && (
        <div className={styles.profileContainer}>
          <h1 className={styles.title}>
            <span className="inline-icon">
              <UserIcon />
            </span>
            <span>Profile</span>
          </h1>

          <ProfileAvatar user={user} className={styles.avatar} />
          <ProfileSections user={user} />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req, params: { userid } }) {
  const token = req.cookies.token;

  if (token) {
    try {
      const { data } = await axios.get('/users/me', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (data.id === userid) {
        return {
          props: {
            user: data,
          },
        };
      }
    } catch (error) {
      console.log(error?.response.status);
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}
