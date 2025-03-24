import styles from './ImageView.module.css';

const ImageView = ({content}) => {
    
    return (
        <div className={styles.imageContainer}>
            <img 
                src={content}
                alt="Тут должно быть изображение"
                className={styles.image}
            />
        </div>
    );
};

export default ImageView;