import logo from '/src/assets/user.svg';
import styles from './UserItem.module.css';

const UserItem = ({data, onSelectClick, isSelect}) => {
    return (
        <div className={`${styles.item} ${isSelect ? styles.active : ""}`} onClick={onSelectClick}>
            <img src={logo} alt="ico"/>
            <span>{data.username}</span>
            <span>{data.email}</span>
        </div>
    )
};

export default UserItem;