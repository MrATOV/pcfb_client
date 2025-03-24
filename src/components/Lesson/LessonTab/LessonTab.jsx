import { useEffect } from "react";
import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import Dialog from "../../Dialog/Dialog";
import { useLessonActions } from "../useLessonActions";
import { useNavigate } from 'react-router-dom';

const LessonTab = () => {
    const navigate = useNavigate();
    const {
        lessonList,
        dialogOpen,
        title,
        setDialogOpen,
        setTitle,
        fetchAddLesson,
        fetchGetLessonList,
        fetchDeleteLesson,
        fetchGetLessonData,
    } = useLessonActions();

    useEffect(() => {
        fetchGetLessonList();
    }, []);

    return (
        <div className={styles.tab}>
            {lessonList.length > 0 && lessonList.map((item) => (
                <LessonItem 
                    key={item.id} 
                    title={item.title} 
                    onClick={() => navigate(`/lesson/${item.id}`)}
                    onDeleteClick={() => fetchDeleteLesson(item.id)}
                />
            ))}
            <button className={styles.addButton} onClick={() => setDialogOpen(true)}>+</button>
            <Dialog open={dialogOpen} onYesClick={() => fetchAddLesson()} onNoClick={() => setDialogOpen(false)}>
                <span>Введите название урока</span>
                <input
                    className={styles.title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название"
                />
            </Dialog>
        </div>
    )
};

export default LessonTab;