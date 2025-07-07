import logo from '/src/assets/user.svg';
import styles from './UserItem.module.css';

const RoleTitle = {
    'student': "Обучающийся",
    'teacher': "Преподаватель",
    'not_confirmed': "Ожидает подтверждения"
}

const UserItemControl = ({ data, onSelectClick, onDeleteClick, isSelect, onConfirmItem, viewMode = 'grid' }) => {
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
            <span className={styles.email}>{RoleTitle[data.role]}</span>
            {data.role === 'not_confirmed' && onConfirmItem && <button onClick={(e) => {e.stopPropagation(); onConfirmItem();}}>✔</button>}
            {onDeleteClick && <button title="Исключить из группы" className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onDeleteClick()}}>✕</button>}
        </div>
    );
};

export default UserItemControl;