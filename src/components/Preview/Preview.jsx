import styles from './Preview.module.css';
import {useNavigate} from "react-router-dom";

const Preview = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <h2>Параллельные вычисления для начинающих</h2>
                <p>Параллельные вычисления — это метод обработки данных, 
                    который позволяет выполнять множество вычислений одновременно. 
                    Наша платформа предлагает вам уникальные возможности для изучения 
                    этой технологии.
                </p>
                <h3>Основные функции:</h3>
                <ul>
                    <li>Онлайн-курсы</li>
                    <li>Учебные материалы</li>
                    <li>Практические упражнения</li>
                    <li>Тестирование параллельных реализаций</li>
                </ul>
                <button onClick={() => navigate("/register")} className={styles.ctaButton}>Начать обучение</button>
            </div>
        </div>
    )
};

export default Preview;