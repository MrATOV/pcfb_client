import {useState} from 'react';
import styles from "./ArgumentBar.module.css"

const ArgumentBar = ({variables, setValues}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={styles.bar}>
            <h2>Ввод переменных</h2>
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
    );
};

export default ArgumentBar;