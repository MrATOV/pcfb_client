import { useEffect, useState } from 'react';
import styles from "./ParametersFields.module.css";

const ParametersFields = ({ declaration, setValue, onParametersChange }) => {
    const [items, setItems] = useState([]);
    const [values, setValues] = useState({});

    useEffect(() => {
        if (declaration && declaration.parameters) {
            setItems(declaration.parameters);
            if (setValue) {
                setValues({ ...setValue });
            } else {
                setValues(declaration.parameters.reduce((acc, parameter) => {
                    if (parameter.type === 'bool') {
                        acc[parameter.title] = false;
                    } else if (parameter.type.startsWith("enumeration")) {
                        acc[parameter.title] = 0;
                    } else if (parameter.type.endsWith('int') || parameter.type.endsWith('long') || parameter.type.endsWith('unsigned')) {
                        acc[parameter.title] = 0;
                    } else if (parameter.type.endsWith('float') || parameter.type.endsWith('double')) {
                        acc[parameter.title] = 0;
                    } else if (parameter.type.includes("char*") || parameter.type.includes("wchar_t*") || parameter.type.includes("string")) {
                        acc[parameter.title] = '';
                    } else {
                        const argumentVariables = declaration.argumentVariables.find(variable => variable.var === parameter.title)?.names;
                        if(argumentVariables && argumentVariables.length > 0) {
                            acc[parameter.title] = argumentVariables[0];
                        } else {
                            acc[parameter.title] = '';
                        }
                    }
                    return acc;
                }, {}));
            }
        }
    }, [declaration, setValue]);

    useEffect(() => {
        if (onParametersChange) {
            onParametersChange(values);
        }
    }, [values, onParametersChange]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    function Parameter(item, index) {
        if (item.type === 'bool') {
            return (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name={item.title} checked={values[item.title]} onChange={handleInputChange} />
                    <span style={{ marginLeft: '8px' }}>{item.title}</span>
                </div>
            );
        }
        if (item.type.startsWith('enumeration')) {
            const enumValues = declaration.enumValues.find(val => val.var === item.title).enum;
            return (
                <div key={index}>
                    <label>{item.title}</label>
                    <select name={item.title} value={values[item.title]} onChange={handleInputChange}>
                        {enumValues.map((value, index) => (
                            <option key={index} value={index}>{value}</option>
                        ))}
                    </select>
                </div>
            );
        }
        if (item.type.endsWith('int') || item.type.endsWith('long') || item.type.endsWith('unsigned')) {
            let min, max;
            
            if (item.type.endsWith('int')) { min = -2147483648; max = 2147483647;
            } else if (item.type.endsWith('long')) { min = -9223372036854775808; max = 9223372036854775807; } 
            else if (item.type.endsWith('unsigned')) { min = 0; max = 4294967295;}
        
            return (
                <div key={index}>
                    <label>{item.title}</label>
                    <input type="number" min={min} max={max} value={values[item.title]} name={item.title} onChange={handleInputChange} />
                </div>
            );
        }
        
        if (item.type.endsWith('float') || item.type.endsWith('double')) {
            let min, max;
            if (item.type.endsWith('float')) { min = -100000; max = 100000; } 
            else if (item.type.endsWith('double')) { min = -1000000; max = 1000000; }
            return (
                <div key={index}>
                    <label>{item.title}</label>
                    <div className={styles.ranger}>
                        <input type='number' name={item.title} step={0.1} min={min} max={max} value={values[item.title]} onChange={handleInputChange} />
                    </div>
                </div>
            );
        }
        if (item.type.includes("char*") || item.type.includes("wchar_t*") || item.type.includes("string")) {
            return (
                <div key={index}>
                    <label>{item.title}</label>
                    <input
                        type="text"
                        placeholder='Введите текст'
                        name={item.title}
                        value={values[item.title] || ''}
                        onChange={handleInputChange}
                    />
                </div>
            );
        }

        const argumentVariables = declaration.argumentVariables.find(variable => variable.var === item.title)?.names;
        return (
            <div key={index}>
                <label>{item.title}</label>
                {argumentVariables && argumentVariables.length > 0 ? 
                    <select name={item.title} value={values[item.title]} onChange={handleInputChange}>
                        {argumentVariables.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                :
                <input
                type="text"
                    placeholder='Введите значение (небезопасно)'
                    name={item.title}
                    value={values[item.title] || ''}
                    onChange={handleInputChange}
                />
                }
            </div>
        )
    }

    return (
        <div className={styles.parameters}>
            {items && items.map((item, index) => Parameter(item, index))}
        </div>
    );
};

export default ParametersFields;