import styles from './Preview.module.css';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MatrixRain from './MatrixRain';

import onlineCoursesImage from '/src/assets/preview/online-courses.png';
import materialsImage from '/src/assets/preview/materials.png';
import ideImage from '/src/assets/preview/ide.png';
import testImage from '/src/assets/preview/test.png';

const Preview = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    
    useEffect(() => {
        setLoaded(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const featureItems = [
        {
            id: 1,
            icon: "📚",
            title: "Онлайн-курсы",
            description: "Интерактивные курсы по параллельным вычислениям с пошаговыми инструкциями и примерами кода.",
            image: onlineCoursesImage
        },
        {
            id: 2,
            icon: "📖",
            title: "Учебные материалы",
            description: "Подробные руководства и документация по всем аспектам параллельного программирования.",
            image: materialsImage
        },
        {
            id: 3,
            icon: "💻",
            title: "Среда разработки",
            description: "Написание программ для отработки навыков параллельного программирования с автоматической проверкой.",
            image: ideImage
        },
        {
            id: 4,
            icon: "⚡",
            title: "Тестирование параллельных реализаций",
            description: "Возможность сравнения производительности разных подходов к параллельным вычислениям.",
            image: testImage
        }
    ];

    return (
        <div className={styles.container}>
            <MatrixRain className={styles.background} />
            <motion.div 
                className={styles.mainContent}
                initial="hidden"
                animate={loaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.h2 variants={itemVariants}>
                    Параллельные вычисления <span>для начинающих</span>
                </motion.h2>
                
                <motion.p variants={itemVariants}>
                    Параллельные вычисления — это метод обработки данных, 
                    который позволяет выполнять множество вычислений одновременно. 
                    Наша платформа предлагает вам уникальные возможности для изучения 
                    этой технологии.
                </motion.p>
                
                <motion.h3 variants={itemVariants}>Основные функции:</motion.h3>
                
                <motion.ul variants={itemVariants} className={styles.featuresList}>
                    {featureItems.map((item) => (
                        <motion.li 
                            key={item.id}
                            className={`${styles.featureItem} ${expandedItem === item.id ? styles.expanded : ''}`}
                            onMouseEnter={() => setExpandedItem(item.id)}
                            onMouseLeave={() => setExpandedItem(null)}
                            initial="collapsed"
                            animate={expandedItem === item.id ? "expanded" : "collapsed"}
                            variants={{
                                collapsed: { 
                                    scale: 1,
                                    background: "var(--background)"
                                },
                                expanded: { 
                                    scale: 1.05,
                                    background: "var(--background)"
                                }
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className={styles.featureHeader}>
                                <span className={styles.featureIcon}>{item.icon}</span>
                                <span className={styles.featureTitle}>{item.title}</span>
                            </div>
                            
                            {expandedItem === item.id && (
                                <motion.div 
                                    className={styles.featureContent}
                                    initial="collapsed"
                                    animate="expanded"
                                    variants={{
                                        collapsed: { opacity: 0, height: 0 },
                                        expanded: { opacity: 1, height: "auto" }
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.featureDescription}>
                                        {item.description}
                                    </div>
                                    <div className={styles.featureImageContainer}>
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            className={styles.featureImage}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </motion.li>
                    ))}
                </motion.ul>
                
                <motion.button 
                    onClick={() => navigate("/register")} 
                    className={styles.ctaButton}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Начать обучение
                </motion.button>
            </motion.div>
        </div>
    )
};

export default Preview;