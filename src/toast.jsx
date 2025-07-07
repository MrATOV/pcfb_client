import React from 'react';
import { createRoot } from 'react-dom/client';
import Toast from './components/Toast/Toast';
import styles from './components/Toast/Toast.module.css';

const toastContainer = document.getElementById('toast-container');

let toastCount = 0;

const showToast = (message, type) => {
    const id = `toast-${toastCount++}`;
    const toastElement = document.createElement('div');
    toastContainer.insertBefore(toastElement, toastContainer.firstChild);
    
    const root = createRoot(toastElement);

    const closeToast = () => {
        const toastNode = document.getElementById(id);
        if (toastNode) {
            toastNode.classList.remove(styles.show);
            setTimeout(() => {
                root.unmount();
                toastElement.remove();
            }, 300);
        }
    };

    root.render(
        <Toast
            id={id}
            message={message}
            type={type}
            onClose={closeToast}
        />
    );
};

export const toast = {
    info: (message) => showToast(message, 'info'),
    warning: (message) => showToast(message, 'warning'),
    error: (message) => showToast(message, 'error')
};