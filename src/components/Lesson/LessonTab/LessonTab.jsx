import { useState, useEffect } from "react";
import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import Dialog from "../../Dialog/Dialog";
import { useLessonActions } from "../useLessonActions";
import { useNavigate } from 'react-router-dom';
import Paginator from '../../Paginator/Paginator';

const LessonTab = ({role}) => {
    const [openLessonList, setOpenLessonList] = useState(true);
    const [filterTitle, setFilterTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    const navigate = useNavigate();
    const {
        authLessonList,
        authCount,
        dialogOpen,
        title,
        private_access,
        description,
        setDialogOpen,
        setTitle,
        setPrivateAccess,
        setDescription,
        fetchAddLesson,
        fetchGetLessonListOwn,
        fetchDeleteLesson,
    } = useLessonActions();

    useEffect(() => {
        fetchGetLessonListOwn(filterTitle, authCount, currentPage, pageSize);
    }, [filterTitle, currentPage]);

    useEffect(() => {
        fetchGetLessonListOwn(filterTitle, null, currentPage, pageSize);
    }, [pageSize]);
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };
    
    const totalPages = Math.ceil(authCount / pageSize) || 1;

    return (
        <div className={styles.tab}>
            <div className={styles.openList}>
                <span style={{width: "10%"}} onClick={() => setOpenLessonList(!openLessonList)}>{openLessonList ? "▼" : "▶"}</span> 
                <span style={{flex: 1}}>Авторские уроки</span>
                {openLessonList && authLessonList.length > 0 &&
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
                {role === 'teacher' && <button className={styles.addButton} onClick={(e) => {e.stopPropagation(); setDialogOpen(true)}}>+</button>}
            </div>
            {openLessonList && authLessonList.length > 0 && authLessonList.map((item) => (
                <LessonItem 
                    key={item.id} 
                    data={item} 
                    onClick={() => navigate(`/lesson/${item.id}/${item.title}`)}
                    onDeleteClick={() => fetchDeleteLesson(item.id)}
                />
            ))}
            {role === 'teacher' && 
                <Dialog 
                    title="Создание урока"
                    open={dialogOpen} 
                    onYesClick={() => fetchAddLesson(title, private_access, description)} 
                    onNoClick={() => setDialogOpen(false)}
                >
                    <span>Введите название урока</span>
                    <input
                        className={styles.title}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название"
                    />
                    <div className={styles.accessCheck}>
                        <input 
                            type="checkbox"
                            checked={private_access}
                            onChange={() => setPrivateAccess(!private_access)}
                        />
                        <span>Приватный доступ</span>
                    </div>
                    <textarea 
                        className={styles.textInput}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание урока (необязательно)"
                    />
                </Dialog>
            }
        </div>
    )
};

export default LessonTab;