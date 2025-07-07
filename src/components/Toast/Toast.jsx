import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';

const Toast = ({ id, message, type, onClose }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (toastRef.current) {
                toastRef.current.classList.add(styles.show);
            }
        }, 10);

        const autoCloseTimer = setTimeout(onClose, 5000);
        return () => {
            clearTimeout(timer);
            clearTimeout(autoCloseTimer);
        };
    }, [onClose]);

    return (
        <div
            ref={toastRef}
            id={id}
            className={`${styles.toast} ${type === 'warning' ? styles.warning : type === 'error' ? styles.error : styles.info}`}
        >
            <div className={styles.message}><div className={styles.icon}>{type === 'info' ? "✔" : type === 'warning' ? "!" : "✕"}</div><p>{message}</p></div>
        </div>
    );
};

export default Toast;