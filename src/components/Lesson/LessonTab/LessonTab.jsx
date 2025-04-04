import { useState, useEffect } from "react";
import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import Dialog from "../../Dialog/Dialog";
import { useLessonActions } from "../useLessonActions";
import { useNavigate } from 'react-router-dom';

const LessonTab = ({role}) => {
    const [openLessonList, setOpenLessonList] = useState(false);

    const navigate = useNavigate();
    const {
        authLessonList,
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
        fetchGetLessonListOwn();
    }, []);
    
    return (
        <div className={styles.tab}>
            <button onClick={() => setOpenLessonList(!openLessonList)}>{openLessonList ? "▼" : "⯈"} Авторские уроки</button>
            {openLessonList && authLessonList.length > 0 && authLessonList.map((item) => (
                <LessonItem 
                    key={item.id} 
                    data={item} 
                    onClick={() => navigate(`/lesson/${item.id}`)}
                    onDeleteClick={() => fetchDeleteLesson(item.id)}
                />
            ))}
            {role === 'teacher' && 
            <>
                <button className={styles.addButton} onClick={() => setDialogOpen(true)}>+</button>
                <Dialog 
                    title="Создание урока"
                    open={dialogOpen} 
                    onYesClick={() => fetchAddLesson()} 
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
            </>}
        </div>
    )
};

export default LessonTab;