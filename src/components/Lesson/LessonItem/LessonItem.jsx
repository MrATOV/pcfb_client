import styles from "./LessonItem.module.css";

const LessonItem = ({title, onClick, onDeleteClick}) => {
    return (
        <div className={styles.item}>
            <button className={styles.itemButton} onClick={onClick}>
                {/* <img src="" alt="Изображение"/> */}
                <h2>{title}</h2>
            </button>
            <button className={styles.deleteButton} onClick={onDeleteClick}>✕</button>
        </div>
    )
};

export default LessonItem;