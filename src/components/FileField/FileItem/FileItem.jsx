import styles from './FileItem.module.css';

const FileItem = ({title, type, logo, onDeleteClick, onSelectClick, isSelect, onItemClick, viewMode = 'grid'}) => {
    return (
        <div className={`${styles.item} ${isSelect ? styles.active : ""} ${
            viewMode === 'table' ? styles.tableMode : styles.gridMode
        }`} onClick={onItemClick}>
            {onSelectClick && <button className={styles.selectButton} onClick={(e) => {e.stopPropagation(); onSelectClick();}}>{ isSelect ? "–" : "+"}</button>}
            <img className={styles.fileLogo} src={logo} alt="ico"/>
            <span className={styles.title}>{title}</span>
            {viewMode === 'table' && <span className={styles.title}>{type}</span>}
            {onDeleteClick && <button className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onDeleteClick();}}>✕</button>}
        </div>
    )
};

export default FileItem;