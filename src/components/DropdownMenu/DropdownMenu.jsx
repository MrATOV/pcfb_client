import { useState, useRef, useEffect } from 'react';
import styles from './DropdownMenu.module.css';

const DropdownMenu = ({ style, isOpen, onClose, children, triggerRef }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <div style={style} className={styles.menu} ref={dropdownRef}>
            {children}
        </div>
    )
};

export default DropdownMenu;