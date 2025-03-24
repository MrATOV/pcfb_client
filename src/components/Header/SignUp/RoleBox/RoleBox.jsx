import styles from './RoleBox.module.css';

const RoleBox = ({ role, setRole }) => {
    return (
        <button type="button" className={`${styles.button} ${role === "student" ? styles.student : styles.teacher}`} onClick={setRole}>
            {role === "student" ? "Студент" : "Учитель"}
        </button>
    );
};

export default RoleBox;