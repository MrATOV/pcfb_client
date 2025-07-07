import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import { useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import axios from "/src/config/axiosLessonsConfig";
import Paginator from '../../Paginator/Paginator';

const LessonTabControl = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterTitle, setFilterTitle] = useState(searchParams.get('filter') || "");
    const [filterUsername, setFilterUsername] = useState(searchParams.get('name') || "");
    const [filterEmail, setFilterEmail] = useState(searchParams.get('email') || "");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 100);
    const [lessonList, setLessonList] = useState([]);
    const [lessonCount, setLessonCount] = useState(0);

    const fetchGetLessonList = async (title, username = null, email = null, total_count = null, page = 1, page_size = 10) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/lesson/list/admin', {
                params: {
                    title,
                    username,
                    email,
                    total_count,
                    page,
                    page_size
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setLessonList(response.data.data);
            setLessonCount(response.data.total_count);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    };

    const fetchDeleteLesson = async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/lesson/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setLessonList(prev => prev.filter(item => item.id !== index));
        } catch (error) {
            console.error('Delete lesson error:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (filterUsername) params.set('name', filterUsername);
        if (filterEmail) params.set('email', filterEmail);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonList(filterTitle, filterUsername, filterEmail, lessonCount, currentPage, pageSize);
    }, [filterTitle, filterUsername, filterEmail, lessonCount, currentPage]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (filterUsername) params.set('name', filterUsername);
        if (filterEmail) params.set('email', filterEmail);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonList(filterTitle, filterUsername, filterEmail, null, currentPage, pageSize);
    }, [pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(lessonCount / pageSize) || 1;
    
    return (
        <div className={styles.tab} style={{alignSelf: 'center', width: "90vw"}}>
            <div className={styles.openList} style={{gap: "10px"}}>
                <input 
                    type="text"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    placeholder="Поиск по названию"
                />
                <input 
                    type="text"
                    value={filterUsername}
                    onChange={(e) => setFilterUsername(e.target.value)}
                    placeholder="Поиск по имени автора"
                />
                <input 
                    type="email"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    placeholder="Поиск по эл. почте"
                />
                <Paginator 
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalPages={totalPages}
                />
            </div>
            {lessonList.length > 0 && lessonList.map((item) => (
                <LessonItem
                    key={item.id}
                    data={item}
                    onDeleteClick={() => fetchDeleteLesson(item.id)}
                />
            ))}
        </div>
    )
};

export default LessonTabControl;
