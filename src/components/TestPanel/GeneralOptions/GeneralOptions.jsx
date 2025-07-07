import { useState, useEffect } from 'react';
import styles from './GeneralOptions.module.css';

const GeneralOptions = ({ threadNumber, declaration, onOptionsChange }) => {
    const [settings, setSettings] = useState({
        iterations: 1,
        threads: [],
        koefficient: 0,
        calculate: 0,
        alpha: 0,
        saveResult: 0,
    });

    const koefficients = ["Среднеквадратическое отклонение", "Коэффициент Стьюдента"];
    const calculates = ["Среднее значение", "Медиана", "Мода"];
    const alphas = ["90%", "95%", "99%"];
    const saveResults = ["Не сохранять", "Сохранять для каждого потока", "Сохранять для каждого набора данных"]

    useEffect(() => {
        setSettings({
            iterations: 2,
            threads: [1, 2],
            koefficient: 0,
            calculate: 0,
            alpha: 0,
            saveResult: 0,
        });
    }, [declaration]);

    useEffect(() => {
        if (onOptionsChange) {
            onOptionsChange(settings);
        }
    }, [settings, onOptionsChange]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckboxChange = (id) => {
        setSettings(prev => {
            const threadsSet = new Set(prev.threads);
            if (threadsSet.has(id + 1)) {
                threadsSet.delete(id + 1);
            } else {
                threadsSet.add(id + 1);
            }
            return { ...prev, threads: Array.from(threadsSet).sort((a, b) => a - b) };
        });
    };

    return (
        <div className={styles.options}>
            <h3>Общие настройки</h3>
            <label>Количество потоков</label>
            <div>
                {Array.from({ length: threadNumber }, (_, id) => (
                    <div key={id} className={styles.threads}>
                        <input 
                            type="checkbox" 
                            checked={settings.threads.includes(id + 1)}
                            onChange={() => handleCheckboxChange(id)}
                        />
                        <span>{id + 1}</span>
                    </div>
                ))}
            </div>
            <div className={styles.iterations}>
                <p>Количество итераций</p>
                <input
                    type="number"
                    name="iterations"
                    min="1"
                    max="100"
                    value={settings.iterations}
                    onChange={handleInputChange}
                />
            </div>
            <label>Коэффициент доверительного интервала</label>
            <select name="koefficient" value={settings.koefficient} onChange={handleInputChange}>
                {koefficients.map((koefficient, id) => (
                    <option key={id} value={id}>{koefficient}</option>
                ))}
            </select>
            <label>Величина для расчета доверительного интервала</label>
            <select name="calculate" value={settings.calculate} onChange={handleInputChange}>
                {calculates.map((calculate, id) => (
                    <option key={id} value={id}>{calculate}</option>
                ))}
            </select>
            <label>Уровень доверия</label>
            <select name="alpha" value={settings.alpha} onChange={handleInputChange}>
                {alphas.map((alpha, id) => (
                    <option key={id} value={id}>{alpha}</option>
                ))}
            </select>
            <label>Сохранение обработанных данных</label>
            <select name="saveResult" value={settings.saveResult} onChange={handleInputChange}>
                {saveResults.map((res, id) => (
                    <option key={id} value={id}>{res}</option>
                ))}
            </select>
        </div>
    );
};

export default GeneralOptions;