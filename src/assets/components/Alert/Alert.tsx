import React, { useEffect, useState } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type,
  onClose,
  autoDismiss = true,
  dismissTime = 5000,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => setIsExiting(true), dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime]);

  useEffect(() => {
    if (isExiting) {
      const exitTimer = setTimeout(onClose, 400); // Match exit animation duration
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting, onClose]);

  return (
    <div
      className={`${styles.alert} ${styles[`alert-${type}`]} ${isExiting ? styles['alert-exit'] : ''}`}
      style={{ '--dismiss-time': `${dismissTime}ms` } as React.CSSProperties}
    >
      <div className={styles['alert-content']}>
        <span className={styles['alert-icon']}>
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className={styles['alert-message']}>{message}</span>
        <button
          className={styles['alert-close']}
          onClick={() => setIsExiting(true)}
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
      {autoDismiss && <div className={styles['alert-progress']} />}
    </div>
  );
};

export default Alert;