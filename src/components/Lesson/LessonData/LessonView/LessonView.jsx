import ContentBlock from '../../ContentBlock/ContentBlock';
import styles from './LessonView.module.css';

const LessonView = ({data, ref}) => {
    
    return (
        <div ref={ref} className={styles.container}>
            {data && data.map((item) => (
                <div className={styles.previewItem} key={item.id} id={`header-${item.order}`}>
                    <ContentBlock type={item.type} content={item.content}/>
                </div>
            ))}
        </div>
    )
};

export default LessonView;