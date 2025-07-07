import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import {Context} from '/src/Context';
import {useLessonActions} from "../useLessonActions";
import Paginator from '../../Paginator/Paginator';

const LessonTabPublic = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterTitle, setFilterTitle] = useState(searchParams.get('filter') || "");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 100);
    const {protectedData} = useContext(Context);
    const {
        publicLessonList,
        publicCount,
        subscriptLessonList,
        subscriptCount,
        fetchGetLessonListSubscript,
        fetchGetLessonListPublic,
        fetchSubscribe,
        fetchUnsubscribe

    } = useLessonActions();

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonListSubscript(filterTitle, publicCount, currentPage, pageSize);
        fetchGetLessonListPublic(filterTitle, publicCount, currentPage, pageSize);
    }, [filterTitle, publicCount, currentPage]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterTitle) params.set('filter', filterTitle);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetLessonListSubscript(filterTitle, null, currentPage, pageSize);
        fetchGetLessonListPublic(filterTitle, null, currentPage, pageSize);
    }, [pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(publicCount / pageSize) || 1;
    
    return (
        <div className={styles.tab} style={{alignSelf: 'center'}}>
            <div className={styles.openList}>
                <span style={{flex: 1}}>Уроки</span>
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
            </div>
            {publicLessonList.length > 0 && publicLessonList.map((item) => (
                <LessonItem
                    key={item.id}
                    data={item}
                    onClick={() => navigate(`/lesson/${item.id}`)}
                    onAddClick={
                        protectedData && 
                        !subscriptLessonList.find(it => it.id === item.id) &&
                        (() => fetchSubscribe(item.id))
                    }
                    onDeleteClick={
                        protectedData && 
                        subscriptLessonList.find(it => it.id === item.id) &&
                        (() => fetchUnsubscribe(item.id))
                    }
                />
            ))}
        </div>
    )
};

export default LessonTabPublic;
