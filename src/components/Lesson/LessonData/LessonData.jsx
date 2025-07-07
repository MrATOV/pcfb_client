import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import { Context } from '/src/Context'; 
import { useLessonActions } from '../useLessonActions';
import {toast} from '/src/toast';
import LessonEdit from './LessonView/LessonEdit';
import LessonView from './LessonView/LessonView';
import Dialog from '../../Dialog/Dialog';
import UserField from '../../UserField/UserField';
import Headers from './Headers/Headers';
import Paginator from '../../Paginator/Paginator';
import styles from './LessonData.module.css';

const LessonData = () => {
    const { protectedData } = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();
    const [role, setRole] = useState('student');
    const [userIndices, setUserIndices] = useState([]);
    const [userListOpen, setUserListOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 2);
    
    const contentRef = useRef();
    const { id, title } = useParams();
    const {
        lessonData,
        lessonBoundary,
        lessonDataCount,
        headers,
        fetchGetLessonData,
        fetchGetLessonToken,
        fetchAddLessonDataItem,
        fetchDeleteLessonData,
        fetchBroadcastNotifications,
        fetchUpdatelessonDataItem
    } = useLessonActions();

    useEffect(() => {
        if (id) {
            fetchGetLessonData(id, null, currentPage, pageSize, true);
        }
    }, [id]);
    
    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 2) params.set('pageSize', pageSize);
        setSearchParams(params);
        if (id) {
            const params = new URLSearchParams();
            if (currentPage > 1) params.set('page', currentPage);
            if (pageSize !== 2) params.set('pageSize', pageSize);
            setSearchParams(params);
            fetchGetLessonData(id, lessonDataCount, currentPage, pageSize, role === 'teacher');
        }
    }, [currentPage]);

    useEffect(() => {
        if (id) {
            const params = new URLSearchParams();
            if (currentPage > 1) params.set('page', currentPage);
            if (pageSize !== 2) params.set('pageSize', pageSize);
            setSearchParams(params);
            fetchGetLessonData(id, null, currentPage, pageSize, role === 'teacher');
            setCurrentPage(1);
        }
    }, [pageSize])

    useEffect(() => {
        if (protectedData) {
            setRole(protectedData["role"]);
        } else {
            setRole('student');
        }
    }, [protectedData]);

    const handleGenerateLink = async () => {
        const link = await fetchGetLessonToken(id);
        try {
            if (link) {
                await navigator.clipboard.writeText(link);
                toast.info("Ссылка скопирована в буфер обмена");
            } else {
                toast.error("Не удалось скопировать ссылку.");
            }
        } catch(error) {
            console.error('Ошибка копирования: ', err);
            toast.error("Не удалось скопировать ссылку.");
        }
    }

    const handleBroadcast = async () => {
        setUserListOpen(false);
        const link = await fetchGetLessonToken(id);
        if (link) {
            const status = await fetchBroadcastNotifications(link, id, userIndices);
            if (status) {
                toast.info("Приглашения отправлены");
            }
        } else {
            toast.error("Не удалось отправить приглашения.");
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
    };

    const handleDeleteItemClick = async (index, lesson_id) => {
        await fetchDeleteLessonData(index, lesson_id);
        const newTotalItems = lessonDataCount - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        if (lessonData.length === 1 && currentPage === newTotalPages + 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } 
        await fetchGetLessonData(id, null, currentPage, pageSize, role === 'teacher');
    };
    
    const handleAddItemClick = async (item, lesson_id) => {
        await fetchAddLessonDataItem(item, lesson_id);
        await fetchGetLessonData(id, null, currentPage, pageSize, role === 'teacher');
    };
    
    const handleUpdateItem = async (order, newContent) => {
        const item = lessonData.find(item => item.order === order, role === 'teacher');
        const newItem = { ...item, content: newContent };
        await fetchUpdatelessonDataItem(newItem);
        await fetchGetLessonData(id, lessonDataCount, currentPage, pageSize, role === 'teacher');
    };
    
    const handleChangeItems = async (firstOrder, secondOrder) => {
        
        let firstItem = lessonData.find(item => item.order === firstOrder);
        const secondItem = lessonData.find(item => item.order === secondOrder);
        if (!firstItem && lessonBoundary.next) {
            firstItem = lessonBoundary.next;
        } else if (!firstItem && lessonBoundary.prev) {
            firstItem = lessonBoundary.prev;
        }

        const updatedFirstItem = { ...firstItem, order: secondOrder };
        const updatedSecondItem = { ...secondItem, order: firstOrder };
        await fetchUpdatelessonDataItem(updatedFirstItem);
        await fetchUpdatelessonDataItem(updatedSecondItem);
        await fetchGetLessonData(id, lessonDataCount, currentPage, pageSize, role === 'teacher');
    };

    const handleHeaderClick = async (newPage, order) => {
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const element = document.getElementById(`header-${order}`);
        if (element && contentRef.current) {
            const elementTop = element.getBoundingClientRect().top;
            const contentTop = contentRef.current.getBoundingClientRect().top;
            const scrollPosition = contentRef.current.scrollTop + elementTop - contentTop;
            
            contentRef.current.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });

            element.style.backgroundColor = 'rgba(30, 144, 255, 0.2)';
            element.style.borderRadius = '10px';
            setTimeout(() => {
                element.style.backgroundColor = '';
                element.style.borderRadius = '';
            }, 1000);
        }
    };

    const handleGoLastPage = async () => {
        const totalPages = Math.ceil(lessonDataCount / pageSize) || 1;
        if (currentPage !== totalPages) {
            setCurrentPage(totalPages);
        }
    };
    
    const totalPages = Math.ceil(lessonDataCount / pageSize) || 1;
    console.log(lessonData);
    return (
        <div className={styles.lessonData}>
            <div className={styles.generalPanel}>
                <h1 style={{marginRight: "auto"}}>{title}</h1>
                {protectedData?.role === 'teacher' && 
                <>
                    <button onClick={handleGenerateLink}>Ссылка</button>
                    <button onClick={() => setUserListOpen(true)}>Отправить приглашения</button>
                    <button onClick={() => setRole(role === 'teacher' ? 'student': 'teacher')}>{role === 'teacher' ? 'Режим просмотра': 'Режим редактирования'}</button>
                    <Dialog 
                        style={{width: "95vw", height: "95vh"}}
                        open={userListOpen}
                        title="Список Обучающихся"
                        onNoClick={() => setUserListOpen(false)}
                        onYesClick={handleBroadcast}
                    >
                        <UserField selectedItems={userIndices} onSelectItems={setUserIndices} />
                    </Dialog>
                </>}
                <Paginator 
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalPages={totalPages}
                />
            </div>
            <div className={styles.contentContainer}>
                <Headers 
                    data={headers} 
                    onHeaderClick={handleHeaderClick}
                    currentPage={currentPage}
                />
                {role === "student" ?
                
                    <LessonView ref={contentRef} data={lessonData}/> 
                :
                    lessonData && <LessonEdit
                        ref={contentRef} 
                        data={lessonData}
                        boundary={lessonBoundary}
                        onChangeItems={handleChangeItems}
                        onUpdateItem={handleUpdateItem}
                        onAddItem={handleAddItemClick}
                        onDeleteItemClick={handleDeleteItemClick}
                        lessonId={id}
                        firstHeaderId={headers[0]?.real_id}
                        onGoLastPage={handleGoLastPage}
                        isFirstPage={totalPages === 1}
                    />
                }
            </div>
        </div>
    )
};

export default LessonData;