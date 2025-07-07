import { useState } from 'react';
import styles from "./ArgumentBar.module.css"

const ArgumentBar = ({ variables, setValues }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`${styles.bar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header} onClick={toggleCollapse}>
                <h2>{isCollapsed ? '❮' : '❯ Ввод переменных'}</h2>
            </div>
            
            {!isCollapsed && (
                <div className={styles.content}>
                    {variables && variables.map(variable => (
                        <div key={variable.name}>
                            <label>
                                {variable.name} <span>{`(${variable.pos[0]}:${variable.pos[1]})`}</span>:
                                <input
                                    type="text"
                                    name={variable.name}
                                    onChange={handleChange}
                                    placeholder={variable.type}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArgumentBar;