import React from 'react';
import styles from './Skeleton.module.css';

export default function Skeleton({ lines = 4 }) {
  return (
    <div className={styles.skeleton} role="status" aria-busy="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={styles.line} />
      ))}
    </div>
  );
}
