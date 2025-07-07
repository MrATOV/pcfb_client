import { useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from "./Modal.module.css";

const Modal = ({style, className, children, open, onCloseClick}) => {
    const dialog = useRef();
    
    useEffect(() => {
        if (open) {
            dialog.current.showModal();
        } else {
            dialog.current.close();
        }
    }, [open]);

    return (
        createPortal (
            <dialog className={`${styles.modal} ${className}`} ref={dialog} style={style}>
                {onCloseClick && <button className={styles.buttonClose} onClick={onCloseClick}>✕</button>}
                {open && children}
            </dialog>,
            document.getElementById('modal')
        )
    )
};

export default Modal;