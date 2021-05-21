import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

import { UserProvider } from '../context/UserContext';

import '../styles/_globals.css';
import '../styles/_variables.css';

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
