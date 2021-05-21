import { useContext } from 'react';

import AsideContext from '../../context/AsideContext';
import ModalContext from '../../context/ModalContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/Warning.module.css';

import { CrossIcon } from '../../utils/icons';

export default function Warning() {
  const { user, userLogout } = useContext(UserContext);
  const { hideModal, optimizeHideModal } = useContext(ModalContext);
  const { cart, saveCart, dropCart } = useContext(AsideContext);

  const saveHandler = async () => {
    await saveCart(user, cart);

    userLogout();
    dropCart();
    hideModal();
  };
  const discardHandler = () => {
    userLogout();
    dropCart();
    hideModal();
  };

  return (
    <div className={styles.warningBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onMouseDown={optimizeHideModal}>
        <CrossIcon />
      </button>

      <h3>There&apos;s unsaved data. Would you like to save it?</h3>

      <div>
        <button type="button" className="btn btn-primary" onClick={saveHandler}>
          Save
        </button>
        <button type="button" className="btn btn-danger" onClick={discardHandler}>
          Discard
        </button>
      </div>
    </div>
  );
}
