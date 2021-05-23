import axios from 'axios';

import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

import { UserProvider } from '../context/UserContext';

import '../styles/_globals.css';
import '../styles/_variables.css';
import { API_URL } from '../utils/urls';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Security-Policy'] = `default-src 'self' ${API_URL}`;
axios.defaults.headers.common['X-Frame-Options'] = 'SAMEORIGIN';
axios.defaults.headers.common['X-XSS-Protection'] = '1; mode=block';
axios.defaults.headers.common['X-Content-Type-Options'] = 'nosniff';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Aside />
      <Modal />
      <Loading />
      <Notification />
    </UserProvider>
  );
}

export default MyApp;
