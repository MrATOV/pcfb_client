import styles from "./LessonItem.module.css";
import privateLogo from "/src/assets/private.svg";
import publicLogo from "/src/assets/public.svg";

const LessonItem = ({ data, onClick, onDeleteClick, onAddClick}) => {
    
    return (
        <div className={styles.item} onClick={onClick}>
            <img src={data.private_access ? privateLogo : publicLogo} alt="Изображение"/>
            {data.username && data.email && <div>
                <h2>{data.username}</h2>    
                <p>{data.email}</p>    
            </div>}
            <div style={{textAlign: "center", flex: 1}}>
                <h2>{data.title}</h2>
                {data.description && <p>{data.description}</p>}
            </div>
            {onAddClick && <button className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onAddClick()}}>🞢</button>}
            {onDeleteClick && <button className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); onDeleteClick()}}>✕</button>}
        </div>
    )
};

export default LessonItem;