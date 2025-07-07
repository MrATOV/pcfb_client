import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {useLessonActions} from "../useLessonActions";
import Paginator from '../../Paginator/Paginator';

const LessonTabSubscript = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [openLessonList, setOpenLessonList] = useState(true);
    const [filterTitle, setFilterTitle] = useState(searchParams.get('filter') || "");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 100);
    
    const {
        subscriptLessonList,
        subscriptCount,
        fetchGetLessonListSubscript,
        fetchUnsubscribe

    } = useLessonActions();

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonListSubscript(filterTitle, subscriptCount, currentPage, pageSize);
    }, [filterTitle, currentPage]);

    useState(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonListSubscript(filterTitle, null, currentPage, pageSize);
    }, [pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };
    
    const totalPages = Math.ceil(subscriptCount / pageSize) || 1;
    
    return (
        <div className={styles.tab}>
            <div className={styles.openList}>
                <span style={{width: "10%"}} onClick={() => setOpenLessonList(!openLessonList)}>{openLessonList ? "▼" : "▶"}</span> 
                <span style={{flex: 1}}>Мои курсы</span>
                {openLessonList &&
                <>
                    <input 
                        type="text"
                        value={filterTitle}
                        onChange={(e) => setFilterTitle(e.target.value)}
                        placeholder="Поиск по названию"
                    />
                    <Paginator 
                        page={currentPage}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        totalPages={totalPages}
                    />
                </>
                }
            </div>
            {openLessonList && subscriptLessonList.length > 0 && subscriptLessonList.map((item) => (
                <LessonItem
                    key={item.id}
                    data={item}
                    onClick={() => navigate(`lesson/${item.id}/${item.title}`)}
                    onDeleteClick={() => fetchUnsubscribe(item.id)}
                />
            ))}
        </div>
    )
};

export default LessonTabSubscript;