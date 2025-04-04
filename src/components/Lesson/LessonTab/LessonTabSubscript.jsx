import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import {Context} from '/src/Context';
import {useLessonActions} from "../useLessonActions";

const LessonTabSubscript = () => {
    const [openLessonList, setOpenLessonList] = useState(true);
    const navigate = useNavigate();
    const {protectedData} = useContext(Context);
    const {
        subscriptLessonList,
        fetchGetLessonListSubscript,
        fetchUnsubscribe

    } = useLessonActions();

    useEffect(() => {
        fetchGetLessonListSubscript();
    }, []);

    console.log(subscriptLessonList);

    return (
        <div className={styles.tab}>
            <button onClick={() => setOpenLessonList(!openLessonList)}>{openLessonList ? "▼" : "⯈"} Подписки</button>
            {openLessonList && subscriptLessonList.length > 0 && subscriptLessonList.map((item) => (
                <LessonItem
                    key={item.id}
                    data={item}
                    onClick={() => navigate(`lesson/${item.id}`)}
                    onDeleteClick={() => fetchUnsubscribe(item.id)}
                />
            ))}
        </div>
    )
};

export default LessonTabSubscript;