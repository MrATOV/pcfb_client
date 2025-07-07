import logo from '/src/assets/user.svg';
import styles from './UserItem.module.css';

const UserItem = ({ data, onSelectClick, onDeleteClick, isSelect, viewMode = 'grid' }) => {
    
    return (
        <div 
            className={`${styles.item} ${isSelect ? styles.active : ''} ${
                viewMode === 'table' ? styles.tableMode : styles.gridMode
            }`}
            onClick={onSelectClick}
        >
            <img src={data.avatar ? data.avatar : logo} alt="ico" className={styles.avatar} />
            <span className={styles.username}>{data.username}</span>
            <span className={styles.email}>{data.email}</span>
            {onDeleteClick && <button title="Исключить из группы" className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onDeleteClick()}}>✕</button>}
        </div>
    );
};

export default UserItem;