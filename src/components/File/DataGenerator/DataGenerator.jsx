import { useState, useEffect } from 'react';
import styles from "./DataGenerator.module.css";

const DataGenerator = ({ onParamsChange }) => {
    const [dataDimension, setDataDimension] = useState(1);
    const [dimensions, setDimensions] = useState([1]);
    const [dataType, setDataType] = useState('int');
    const [generationType, setGenerationType] = useState('random');
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);
    const [startValue, setStartValue] = useState(0);
    const [step, setStep] = useState(1);
    const [incrementInterval, setIncrementInterval] = useState(1);

    const handleParamsChange = () => {
        const params = {
            dataDimension,
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
        const newDimensions = new Array(dataDimension).fill(1);
        setDimensions(newDimensions);
    }, [dataDimension]);

    useEffect(() => {
        handleParamsChange();
    }, [dataDimension, dataType, generationType, minValue, maxValue, startValue, step, incrementInterval, dimensions]);

    return (
        <div className={styles.dataGenerator}>
            <label>
                Размерность данных:
                <input
                    type="number"
                    value={dataDimension}
                    onChange={(e) => setDataDimension(parseInt(e.target.value, 10))}
                    min={1}
                    max={10}
                />
            </label>

            {dimensions.map((dimension, index) => (
                <label key={index}>
                    Размер {index + 1}:
                    <input
                        type="number"
                        value={dimension}
                        onChange={(e) => handleDimensionChange(index, e.target.value)}
                        min={1}
                    />
                </label>
            ))}

            <label>
                Тип данных:
                <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                    <option value="int">Целые числа</option>
                    <option value="float">Вещественные числа</option>
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