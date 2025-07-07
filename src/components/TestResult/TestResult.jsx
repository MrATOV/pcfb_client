import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import PerformanceHeader from './PerformanceHeader/PerformaceHeader';
import PerformanceTable from './PerformanceTable/PerformanceTable';
import PerformanceChart from './PerformanceChart/PerformanceChart';
import styles from './TestResult.module.css';
import axios from '../../config/axiosUsersConfig';
import FileView from '../FileField/FileView/FileView';
import {useDataActions} from '../FileField/useDataActions';
import {toast} from '../../toast';

const TestResult = ({open, onCloseClick, data, title, onRemoveDataItem}) => {
    const [showChart, setShowChart] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('time');
    const [testName, setTestName] = useState('Название тестирования');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [processingDataOpen, setProcessingDataOpen] = useState(false);
    const [procData, setProcData] = useState('null');
    const [currentTitle, setCurrentTitle] = useState(title);
    const {dataContent, fetchGetDataContent} = useDataActions();
    

    const handleSaveClick = async () => {
        data[currentIndex].title = testName;
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post('/test', data[currentIndex], {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            if (data.length === 1) {
                onCloseClick();
                onRemoveDataItem(currentIndex);
            } else {
                onRemoveDataItem(currentIndex);
            }

            toast.info("Результаты теста успешно сохранены"); 
        } catch (error) {
            toast.error("Не удалось сохранить результаты теста");
            console.error("Error save data:", error);
        }
    }

    const handleGenerateClick = async () => {
        try {
            console.log(data[currentIndex]); 
            const response = await axios.post('/report', data[currentIndex], {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });
            if (response.status === 200) {
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const fileUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = 'report.pdf';
                link.click();
                URL.revokeObjectURL(fileUrl);
            } else {
                toast.error("Произошла ошибка при генерации отчета");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (data && data.length > 0) {
            setCurrentIndex(0);
            setProcData(data[0].results[0]);
        }
    }, [data]);

    useEffect(() => {
        setCurrentTitle(title);
    }, [title]);

    const handleProcessingDataOpen = async (filename) => {
        await fetchGetDataContent(procData?.type, filename, data[currentIndex].dir);
        setProcessingDataOpen(true);
    }
    console.log(data);
    return (
        <Modal open={open} onCloseClick={onCloseClick} style={{ width: '85vw', maxWidth: '1200px' }}>
            {data && data.length > 0 && (
                <div className={styles.container}>
                    {data.length > 1 && <div className={styles.resultButtons}>
                        {data.map((_, index) => (
                            <button 
                                key={index} 
                                className={index == currentIndex ? styles.active : ""} 
                                onClick={() => {setCurrentIndex(index); setDataType(data[index].data[0].type); setCurrentTitle(null);}}
                            >
                                Результат {index}
                            </button>
                        ))}
                    </div>} 
                    <PerformanceHeader
                        title={data[currentIndex].title}
                        testName={testName}
                        setTestName={setTestName}
                        onSaveClick={handleSaveClick}
                        onGenerateClick={handleGenerateClick}
                        showChart={showChart}
                        setShowChart={setShowChart}
                    />
                    <h2>{data[currentIndex].global_analysis}</h2>
                    <div className={styles.content}>
                        {data[currentIndex].results.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles.test_item}>
                                <h2 className={styles.item_title}>{item.title}</h2>
                                {item.data.map((argItem, argIndex) => (
                                    <div key={argIndex}>
                                        <p className={styles.item_args}>{argItem.args}</p>
                                        <p className={styles.item_args}>{argItem.analysis}</p>
                                        {argItem.processing_data && <p>Обработанные данные</p>}
                                        {showChart ? (
                                            <PerformanceChart 
                                                data={argItem.performance}
                                                selectedMetric={selectedMetric}
                                                onMetricChange={setSelectedMetric}
                                            />
                                        ) : (
                                            <PerformanceTable performance={argItem.performance} onProcDataClick={handleProcessingDataOpen} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <FileView 
                        open={processingDataOpen} 
                        onCloseClick={() => setProcessingDataOpen(false)} 
                        data={procData}
                        content={dataContent}
                        path={data[currentIndex].dir}
                    />
                </div>
            )}
        </Modal>
    );
};

export default TestResult;