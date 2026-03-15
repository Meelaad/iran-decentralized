import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ title = 'Nothing here', message = '', actionLabel, onAction }) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>⚿</div>
      <div className={styles.title}>{title}</div>
      {message && <div className={styles.message}>{message}</div>}
      {actionLabel && <button className={styles.action} onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
