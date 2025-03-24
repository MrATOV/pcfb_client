import ContentBlock from '../ContentBlock/ContentBlock';
import styles from './LessonData.module.css';

const LessonView = ({data}) => {

    return (
        <div className={styles.container}>
            {data && data.map((item) => (
                <div className={styles.item} key={item.id}>
                    <ContentBlock type={item.type} content={item.content}/>
                </div>
            ))}
        </div>
    )
};

export default LessonView;