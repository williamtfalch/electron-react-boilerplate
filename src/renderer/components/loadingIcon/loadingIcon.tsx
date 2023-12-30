/* eslint-disable import/prefer-default-export */
import React from 'react';
import styles from './styles.module.css';

export function LoadingIcon() {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
    </div>
  );
}
