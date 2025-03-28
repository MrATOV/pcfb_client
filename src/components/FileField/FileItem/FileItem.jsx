import styles from './FileItem.module.css';

const FileItem = ({children, logo, onDeleteClick, onSelectClick, isSelect, onItemClick}) => {
    return (
        <div className={`${styles.item} ${isSelect ? styles.active : ""}`} onClick={onItemClick}>
            {onDeleteClick && <button className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onDeleteClick();}}>✕</button>}
            {onSelectClick && <button className={styles.selectButton} onClick={(e) => {e.stopPropagation(); onSelectClick();}}>{ isSelect ? "-" : "+"}</button>}
            <img src={logo} alt="ico"/>
            <span className={styles.title}>{children}</span>
        </div>
    )
};

export default FileItem;