import styles from "./LessonItem.module.css";
import privateLogo from "/src/assets/private.svg";
import publicLogo from "/src/assets/public.svg";

const LessonItem = ({ data, onClick, onDeleteClick, onAddClick}) => {
    return (
        <div className={styles.item}>
            <button className={styles.itemButton} onClick={onClick}>
                <img src={data.private_access ? privateLogo : publicLogo} alt="Изображение"/>
                <h2>{data.title}</h2>
                {data.description && <p>{data.description}</p>}
            </button>
            {onAddClick && <button className={styles.deleteButton} onClick={onAddClick}>+</button>}
            {onDeleteClick && <button className={styles.deleteButton} onClick={onDeleteClick}>✕</button>}
        </div>
    )
};

export default LessonItem;