import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './PerformanceChart.module.css';
import dataLogo from '/src/assets/data.svg';

const METRIC_LABELS = {
    time: 'Время (сек)',
    acceleration: 'Ускорение',
    efficiency: 'Эффективность',
    cost: 'Стоимость',
    amdahl_acceleration: 'Т. ускорение Амдала',
    gustavson_acceleration: 'Т. ускорение Густавсона-Барсиса'
};

const PerformanceChart = ({ data, selectedMetric, onMetricChange }) => {
    const [containerSize, setContainerSize] = useState({ width: 800, height: 400 });

    useEffect(() => {
        const updateSize = () => {
            const container = document.querySelector(`.${styles.chart_container}`);
            if (container) {
                setContainerSize({
                    width: container.clientWidth,
                    height: Math.min(400, container.clientWidth * 0.5)
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const axisStyle = {
        tick: { fill: 'var(--text-color)' },
        axisLabel: { fill: 'var(--text-color)' }
    };
console.log(data);
    return (
        <div className={styles.chart_wrapper}>
            <div className={styles.metric_selector}>
                {['time', 'acceleration', 'efficiency', 'cost', 'amdahl_acceleration', 'gustavson_acceleration'].map(metric => (
                    <button
                        key={metric}
                        onClick={() => onMetricChange(metric)}
                        className={`${styles.metric_button} ${selectedMetric === metric ? styles.active : ''}`}
                    >
                        {METRIC_LABELS[metric]}
                    </button>
                ))}
            </div>
            <div className={styles.chart_container}>
                <ResponsiveContainer width="100%" height={containerSize.height}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--text-color)" />
                        <XAxis 
                            dataKey="thread" 
                            label={{ 
                                value: 'Потоки', 
                                position: 'bottom',
                                style: axisStyle.axisLabel
                            }} 
                            tick={axisStyle.tick}
                        />
                        <YAxis 
                            label={{ 
                                value: METRIC_LABELS[selectedMetric], 
                                angle: -90, 
                                position: 'left',
                                style: axisStyle.axisLabel
                            }} 
                            tick={axisStyle.tick}
                        />
                        <Tooltip 
                            formatter={(value) => selectedMetric === 'time' || selectedMetric === 'cost' 
                                ? Number(value).toFixed(6) 
                                : Number(value).toFixed(3)}
                            labelFormatter={(value) => `Потоки: ${value}`}
                            contentStyle={{
                                backgroundColor: 'var(--background-color)',
                                borderColor: 'var(--text-color)',
                                color: 'var(--text-color)'
                            }}
                        />
                        <Bar 
                            dataKey={selectedMetric} 
                            name={METRIC_LABELS[selectedMetric]}
                            fill="dodgerblue" 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;