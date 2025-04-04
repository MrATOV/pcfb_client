import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonTab.module.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import {Context} from '/src/Context';
import {useLessonActions} from "../useLessonActions";

const LessonTabPublic = () => {
    const navigate = useNavigate();
    const {protectedData} = useContext(Context);
    const {
        publicLessonList,
        subscriptLessonList,
        fetchGetLessonListSubscript,
        fetchGetLessonListPublic,
        fetchSubscribe,
        fetchUnsubscribe

    } = useLessonActions();

    useEffect(() => {
        fetchGetLessonListSubscript();
        fetchGetLessonListPublic();
    }, []);

    console.log(publicLessonList);

    return (
        <div className={styles.tab}>
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
