import { useState, useEffect } from 'react';
import styles from './ImageView.module.css';

const ImageView = ({ url }) => {
    const [scale, setScale] = useState(1);
    const [imageUrl, setImageUrl] = useState(null)
    console.log(url);
    useEffect(() => {
        if (url) {
            setImageUrl(url);
            setScale(1);
        }
    }, [url]);

    const handleZoomIn = () => {
        setScale(prev => prev * 1.2);
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 1));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <button title="Увеличить" onClick={handleZoomIn}>+</button>
                <span>🔍︎</span>
                <button title="Уменьшить" onClick={handleZoomOut}>–</button>
            </div>
            <div className={styles.imageContainer}>
                <div className={styles.image} style={{transform: `scale(${scale})`}}>
                    <img src={imageUrl} alt="Изображение"/>
                </div>
            </div>
        </div>
    );
};

export default ImageView;