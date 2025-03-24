import { useEffect, useState } from "react";
import ParametersFields from "./ParametersFields/ParametersFields";
import styles from './ParametersOptions.module.css';

const ParametersOptions = ({ declaration, onParameterSetChange }) => {
    const [parameterSetList, setParameterSetList] = useState([]);
    const [currentSet, setCurrentSet] = useState({
        title: '',
        parameters: null
    });
    const [currentParameters, setCurrentParameters] = useState({});
    const [warningMessage, setWarningMessage] = useState(null);
    const addTitle = "✎...";

    useEffect(() => {
        setParameterSetList([]);
        setCurrentSetNew();
        setCurrentParameters({});
        setWarningMessage(null);
    }, [declaration]);

    const handleAddParameterSet = () => {
        const title = Object.entries(currentParameters).map(([key, value]) => `${key}: ${value}`).join(", ");
        const existingParameterSet = parameterSetList.find((set) => set.title === title);

        if (!existingParameterSet) {
            const newParameterSet = {
                title: title,
                parameters: currentParameters
            };
            const updatedParameterSetList = [...parameterSetList, newParameterSet];
            setParameterSetList(updatedParameterSetList);
            setCurrentSetNew();
            if (onParameterSetChange) {
                onParameterSetChange(updatedParameterSetList);
            }
            setWarningMessage(null);
        } else {
            setWarningMessage("Такой набор параметров уже добавлен.");
        }
    };

    const handleEditParameterSet = () => {
        const title = Object.entries(currentParameters).map(([key, value]) => `${key} ${value}`).join(", ");
        const existingParameterSet = parameterSetList.find((set) => set.title === title && set.title !== currentSet.title);

        if (!existingParameterSet) {
            const updatedParameterSetList = parameterSetList.map((set) => {
                if (set.title === currentSet.title) {
                    return {
                        title: title,
                        parameters: currentParameters
                    };
                }
                return set;
            });
            setParameterSetList(updatedParameterSetList);
            setCurrentSet({
                title: title,
                parameters: currentParameters
            });
            if (onParameterSetChange) {
                onParameterSetChange(updatedParameterSetList);
            }
            setWarningMessage(null);
        } else {
            setWarningMessage("Такой набор параметров уже существует.");
        }
    };

    const handleRemoveParameterSet = (title) => {
        const updatedParameterSetList = parameterSetList.filter((item) => item.title !== title);
        setParameterSetList(updatedParameterSetList);
        setCurrentSetNew();
        if (onParameterSetChange) {
            onParameterSetChange(updatedParameterSetList);
        }
    };

    const handleSetSelected = (item) => {
        setWarningMessage(null);
        setCurrentSet({
            title: item.title,
            parameters: item.parameters
        });
    };

    const setCurrentSetNew = () => {
        setCurrentSet({
            title: addTitle,
            parameters: null
        });
        setCurrentParameters({});
    };

    const handleNewSetSelected = () => {
        setWarningMessage(null);
        setCurrentSetNew();
    };

    const handleParametersChange = (values) => {
        setCurrentParameters(values);
    };

    return (
        <div className={styles.parametersOptions}>
            <h3>Параметры алгоритма</h3>
            <ul className={styles.parameterSetContainer}>
                {parameterSetList.map((item, index) => (
                    <li
                        key={index}
                        className={`${styles.parameterSet} ${currentSet.title === item.title && styles.active}`}
                        onClick={() => handleSetSelected(item)}
                        title={item.title}
                    >
                        <span className={styles.parameterSetText}>{item.title}</span>
                        <button className={styles.buttonDelete} onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveParameterSet(item.title);
                        }}>✕</button>
                    </li>
                ))}
                <li
                    className={`${styles.parameterSet} ${currentSet.title === addTitle && styles.active}`}
                    onClick={handleNewSetSelected}
                >
                    {addTitle}
                </li>
            </ul>
            <button className={styles.buttonAdd} onClick={currentSet.title === addTitle ? handleAddParameterSet : handleEditParameterSet}>
                {currentSet.title === addTitle ? "Добавить набор" : "Изменить"}
            </button>
            {warningMessage && <label>{warningMessage}</label>}
            <ParametersFields
                declaration={declaration}
                setValue={currentSet.parameters}
                onParametersChange={handleParametersChange}
            />
        </div>
    );
};

export default ParametersOptions;