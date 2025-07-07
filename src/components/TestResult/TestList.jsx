import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import TestResult from './TestResult';
import Paginator from '../Paginator/Paginator';
import axios from '/src/config/axiosUsersConfig';
import styles from './TestList.module.css';

import cancelLogo from '/src/assets/field_icons/cancel.svg';

const DateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ru-RU');
    const formattedTime = date.toLocaleTimeString('ru-RU');
    return `${formattedDate} ${formattedTime}`;
}

const TestList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentData, setCurrentData] = useState([]);
    const [resultOpen, setResultOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [title, setTitle] = useState(null);
    const [filterTitle, setFilterTitle] = useState(searchParams.get('filter') || "");
    const [dateFilter, setDateFilter] = useState({
        start: null,
        end: null
    });
    const [testCount, setTestCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 100);
    
    const fetchGetTestList = async (title, start, end, total_count, page, page_size) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/test/list', {
                params: {
                    title: title || undefined,
                    start: start || undefined,
                    end: end || undefined,
                    total_count,
                    page,
                    page_size
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setDataList(response.data.tests);
            setTestCount(response.data.total_count);
        } catch (error) {
            console.error('Error load test data', error);
        }
    }

    const fetchDeleteTestData = async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/test/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setDataList(prev => prev.filter(item => item.id != index));
        } catch (error) {
            console.error('Error deleteing test', error);
        }
    }
    
    const fetchGetTestData = async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get(`/test/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setCurrentData([response.data]);
        } catch (error) {
            console.error('Error load test data', error);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetTestList(filterTitle, dateFilter.start, dateFilter.end, testCount, currentPage, pageSize);
    }, [filterTitle, dateFilter, currentPage, pageSize]);

    const handleOpenTestResult = async (index, title) => {
        await fetchGetTestData(index);
        setTitle(title);
        setResultOpen(true);
    }

    const handleDateRangeChange = (startValue, endValue) => {
        if (!startValue || !endValue) {
            setDateFilter({ start: null, end: null });
        } else {
            setDateFilter({ 
                start: startValue,
                end: endValue
            });
        }
    }

    const handleStartDateChange = (e) => {
        const startValue = e.target.value;
        const endValue = dateFilter.end || 
                        (startValue ? new Date(new Date(startValue).getTime() + 86400000).toISOString().slice(0, 16) : null);
        
        handleDateRangeChange(startValue, endValue);
    }

    const handleEndDateChange = (e) => {
        const endValue = e.target.value;
        const startValue = dateFilter.start || 
                          (endValue ? new Date(new Date(endValue).getTime() - 86400000).toISOString().slice(0, 16) : null);
        
        handleDateRangeChange(startValue, endValue);
    }

    const handleResetDates = () => {
        setDateFilter({ start: null, end: null });
    }

    const filteredData = dataList.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(filterTitle.toLowerCase());
        
        let dateMatch = true;
        if (dateFilter.start && dateFilter.end) {
            const itemDate = new Date(item.date).getTime();
            const startDate = new Date(dateFilter.start).getTime();
            const endDate = new Date(dateFilter.end).getTime();
            
            dateMatch = itemDate >= startDate && itemDate <= endDate;
        }
        
        return titleMatch && dateMatch;
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };
    
    const totalPages = Math.ceil(testCount / pageSize) || 1;
    
    return (
        <div className={styles.testList}>
            <div className={styles.panel}>
                <input
                    type="text"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    placeholder="Поиск по названию"
                    className={styles.filterInput}
                />
                <div className={styles.dateFilter}>
                    <label>От:</label>
                    <input
                        type="datetime-local"
                        value={dateFilter.start || ''}
                        onChange={handleStartDateChange}
                        className={styles.dateInput}
                    />
                    <label>До:</label>
                    <input
                        type="datetime-local"
                        value={dateFilter.end || ''}
                        onChange={handleEndDateChange}
                        className={styles.dateInput}
                    />
                    <button 
                        onClick={handleResetDates}
                        className={styles.resetButton}
                        disabled={!dateFilter.start && !dateFilter.end}
                        title="Сбросить даты"
                    >
                        <img src={cancelLogo} alt=""/>
                    </button>
                </div>
                <Paginator 
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalPages={totalPages}
                />
            </div>
            <div className={styles.container}>
                {filteredData.length > 0 ? (
                    filteredData.map(item => (
                        <div className={styles.item} key={item.id} onClick={() => handleOpenTestResult(item.id, item.title)}>
                            <span className={styles.text}>{item.title}</span>
                            <span className={styles.date}>{DateTime(item.date)}</span>
                            <button 
                                className={styles.deleteButton} 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    fetchDeleteTestData(item.id)
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.noResults}>Ничего не найдено</div>
                )}
            </div>
            <TestResult open={resultOpen} onCloseClick={() => setResultOpen(false)} data={currentData} title={title}/>
        </div>
    )
};

export default TestList;