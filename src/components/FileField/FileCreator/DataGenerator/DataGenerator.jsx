import { useState, useEffect } from 'react';
import styles from "./DataGenerator.module.css";

const DataGenerator = ({ onParamsChange, type }) => {
    const [dimensions, setDimensions] = useState([1]);
    const [dataType, setDataType] = useState(0);
    const [generationType, setGenerationType] = useState('random');
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);
    const [startValue, setStartValue] = useState(0);
    const [step, setStep] = useState(1);
    const [incrementInterval, setIncrementInterval] = useState(1);

    const handleParamsChange = () => {
        const params = {
            dataType,
            generationType,
            dimensions,
        };

        if (generationType === 'random') {
            params.minValue = minValue;
            params.maxValue = maxValue;
        } else if (generationType === 'ascending' || generationType === 'descending') {
            params.startValue = startValue;
            params.step = step;
            params.incrementInterval = incrementInterval;
        }

        onParamsChange(params);
    };

    const handleDimensionChange = (index, value) => {
        const newDimensions = [...dimensions];
        newDimensions[index] = parseInt(value, 10);
        setDimensions(newDimensions);
    };

    useEffect(() => {
        const newDimensions = new Array(type === 'matrix' ? 2 : 1).fill(1);
        setDimensions(newDimensions);
    }, [type]);

    useEffect(() => {
        handleParamsChange();
    }, [dataType, generationType, minValue, maxValue, startValue, step, incrementInterval, dimensions]);

    return (
        <div className={styles.dataGenerator}>
            {dimensions.length === 2 ? (
                <>
                    <label>
                        Количество строк:
                        <input
                            type="number"
                            value={dimensions[0]}
                            onChange={(e) => handleDimensionChange(0, e.target.value)}
                            min={1}
                        />
                    </label>
                    <label>
                        Количество столбцов:
                        <input
                            type="number"
                            value={dimensions[1]}
                            onChange={(e) => handleDimensionChange(1, e.target.value)}
                            min={1}
                        />
                    </label>
                </>
            ) : (
                <label>
                    Количество элементов:
                    <input
                        type="number"
                        value={dimensions[0]}
                        onChange={(e) => handleDimensionChange(0, e.target.value)}
                        min={1}
                    />
                </label>  
            )}

            <label>
                Тип данных:
                <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                    <option value={0}>Целые числа "char"</option>
                    <option value={1}>Целые числа "unsigned char"</option>
                    <option value={2}>Целые числа "short"</option>
                    <option value={3}>Целые числа "unsigned short"</option>
                    <option value={4}>Целые числа "int"</option>
                    <option value={5}>Целые числа "unsgined int"</option>
                    <option value={6}>Целые числа "long"</option>
                    <option value={7}>Целые числа "unsigned long"</option>
                    <option value={8}>Вещественные числа "float"</option>
                    <option value={9}>Вещественные числа "double"</option>
                </select>
            </label>

            <label>
                Тип генерации:
                <select value={generationType} onChange={(e) => setGenerationType(e.target.value)}>
                    <option value="random">Случайные значения</option>
                    <option value="ascending">Восходящая последовательность</option>
                    <option value="descending">Нисходящая последовательность</option>
                </select>
            </label>

            {generationType === 'random' && (
                <>
                    <label>
                        Минимальное значение:
                        <input
                            type="number"
                            value={minValue}
                            onChange={(e) => setMinValue(parseFloat(e.target.value))}
                        />
                    </label>
                    <label>
                        Максимальное значение:
                        <input
                            type="number"
                            value={maxValue}
                            onChange={(e) => setMaxValue(parseFloat(e.target.value))}
                        />
                    </label>
                </>
            )}

            {(generationType === 'ascending' || generationType === 'descending') && (
                <>
                    <label>
                        Начальное значение:
                        <input
                            type="number"
                            value={startValue}
                            onChange={(e) => setStartValue(parseFloat(e.target.value))}
                        />
                    </label>
                    <label>
                        Шаг изменения:
                        <input
                            type="number"
                            value={step}
                            onChange={(e) => setStep(parseFloat(e.target.value))}
                        />
                    </label>
                    <label>
                        Через сколько элементов увеличивать:
                        <input
                            type="number"
                            value={incrementInterval}
                            onChange={(e) => setIncrementInterval(parseInt(e.target.value, 10))}
                        />
                    </label>
                </>
            )}
        </div>
    );
};

export default DataGenerator;