import {useContext} from 'react';
import {Context} from '/src/Context';
import styles from './PerformanceHeader.module.css';

import saveIcon from "/src/assets/icons/save.svg";
import saveIconDark from "/src/assets/icons/dark/save.svg";
import reportIcon from "/src/assets/icons/report.svg";
import reportIconDark from "/src/assets/icons/dark/report.svg";
import tableIcon from "/src/assets/icons/table.svg";
import tableIconDark from "/src/assets/icons/dark/table.svg";
import chartIcon from "/src/assets/icons/chart.svg";
import chartIconDark from "/src/assets/icons/dark/chart.svg";

const PerformanceHeader = ({title, testName, setTestName, onSaveClick, onGenerateClick, showChart, setShowChart}) => {
    const { isDark } = useContext(Context);
    
    return (
        <div className={styles.header}>
            {!title ? (
                <>
                    <input
                        type="text"
                        placeholder="Введите название тестирования"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        className={styles.text_input}
                    />
                    <div className={styles.actions}>
                        <button 
                            title="Сохранить результат в БД" 
                            onClick={() => onSaveClick(testName)}
                        >
                            <img src={isDark ? saveIconDark : saveIcon} alt="Сохранить" />
                        </button>
                    </div>
                </>
            ) : (
                <h1>{title}</h1>
            )}
            <div className={styles.actions}>
                <button 
                    title="Создать отчет" 
                    onClick={onGenerateClick}
                    >
                    <img src={isDark ? reportIconDark : reportIcon} alt="Отчет" />
                </button>
                <button 
                    title={showChart ? "Показать таблицу" : "Показать график"} 
                    onClick={() => setShowChart(!showChart)}
                    className={styles.toggleButton}
                    >
                    {showChart ? 
                        <img src={isDark ? tableIconDark : tableIcon} alt="Таблица"/>
                    : 
                    <img src={isDark ? chartIconDark : chartIcon} alt="График"/>
                }
                </button>
            </div>
        </div>
    );
};

export default PerformanceHeader;