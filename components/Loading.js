import styles from '../styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <img src="/icons/loading.svg" alt="loading..." className="loading" />
    </div>
  );
}
