import React from 'react';
import styles from './PerformanceTable.module.css';
import dataLogo from '/src/assets/data.svg';


const PerformanceTable = ({ performance, onProcDataClick }) => {
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
                        <th>Т. ускорение Амдала</th>
                        <th>Т. ускорение Густавсона-Барсиса</th>
                        {performance[0].processing_data && <th>Данные</th>}
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
                            <td>{perf.amdahl_acceleration ? perf.amdahl_acceleration.toFixed(3) : "-"}</td>
                            <td>{perf.gustavson_acceleration ? perf.gustavson_acceleration.toFixed(3) : "-"}</td>
                            {perf.processing_data && 
                            <td onClick={() => onProcDataClick(perf.processing_data)} style={{padding: "0 1rem"}}>
                                    <img style={{height: "2rem"}} src={dataLogo} alt="Данные"/>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PerformanceTable;