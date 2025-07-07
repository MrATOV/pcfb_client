import LessonTab from './LessonTab/LessonTab';
import LessonTabSubscript from './LessonTab/LessonTabSubscript';
import styles from './LessonList.module.css';

const LessonList = ({role}) => {
    return (
        <div className={styles.lessonList}>
            {role === 'teacher' ? 
                <LessonTab role={role}/>
            :
                <LessonTabSubscript/>
            }
        </div>
    )
};

export default LessonList;