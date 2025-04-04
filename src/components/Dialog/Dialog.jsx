import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import styles from './Dialog.module.css';

const Dialog = ({style, title = "Внимание", children, open, onYesClick, onNoClick}) => {
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
            <dialog className={styles.dialog} ref={dialog} style={style}>
                <h3>{title}</h3>
                {open && children}
                <div className={styles.buttons}>
                    {onYesClick && <button className={styles.buttonYes} onClick={onYesClick}>Да</button>}
                    {onNoClick && <button className={styles.buttonNo} onClick={onNoClick}>Нет</button>}
                </div>
            </dialog>,
            document.getElementById('dialog')
        )
    )
};

export default Dialog;