import styles from './HeaderEditor.module.css';

const HeaderEditor = ({ content, onUpdate }) => {
    return (
        <input
            className={styles.inputText}
            type="text"
            value={content}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Введите заголовок"
        />
    );
};

export default HeaderEditor;