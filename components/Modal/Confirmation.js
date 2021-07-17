import { useContext } from 'react';

import GeneralContext from '../../context/GeneralContext';

import styles from '../../styles/Modal/Confirmation.module.css';

import { CrossIcon } from '../../utils/icons';

export default function Confirmation({ message, accept, decline }) {
  const {
    modal: { hideModal },
  } = useContext(GeneralContext);

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <p className={styles.confirmation}>{message}</p>

      <div>
        <button type="button" className="btn btn-danger" onClick={decline}>
          Decline
        </button>
        <button type="button" className="btn btn-primary" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  );
}
