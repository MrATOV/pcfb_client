import { useState, useEffect } from "react";
import TestResult from './TestResult';
import axios from '/src/config/axiosLessonsConfig';

const TestList = () => {
    const [currentData, setCurrentData] = useState([]);
    const [resultOpen, setResultOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [title, setTitle] = useState(null);

    const fetchGetTestList = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/test/list', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setDataList(response.data);
        } catch (error) {
            console.error('Error load test data', error);
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
        fetchGetTestList();
    }, []);

    const handleOpenTestResult = async (index, title) => {
        await fetchGetTestData(index);
        setTitle(title);
        setResultOpen(true);
    }
    
    return (
        <div>
            {dataList && dataList.map(item => (
                <div key={item.id} onClick={() => handleOpenTestResult(item.id, item.title)}>
                    <span>{item.title}</span>
                    <span>{item.date}</span>
                </div>
            ))}
            <TestResult open={resultOpen} onCloseClick={() => setResultOpen(false)} data={currentData} title={title}/>
        </div>
    )
};

export default TestList;