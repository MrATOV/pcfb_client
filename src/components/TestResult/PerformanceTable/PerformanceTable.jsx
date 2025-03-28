import React from 'react';
import styles from './PerformanceTable.module.css';

const PerformanceTable = ({ performance }) => {
    return (
        <div className={styles.performance_table}>
            <table>
                <thead>
                    <tr>
                        <th>Потоки</th>
                        <th>Время (сек)</th>
                        <th>Ускорение</th>
                        <th>Стоимость</th>
                        <th>Эффективность</th>
                    </tr>
                </thead>
                <tbody>
                    {performance.map((perf, perfIndex) => (
                        <tr key={perfIndex}>
                            <td>{perf.thread}</td>
                            <td>{perf.time.toFixed(6)}</td>
                            <td>{perf.acceleration.toFixed(3)}</td>
                            <td>{perf.cost.toFixed(6)}</td>
                            <td>{perf.efficiency.toFixed(3)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PerformanceTable;