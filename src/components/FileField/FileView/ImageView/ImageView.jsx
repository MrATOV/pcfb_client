import { useState, useEffect } from 'react';
import axios from '/src/config/axiosLessonsConfig';

const ImageView = ({ url }) => {
    const [scale, setScale] = useState(1);
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        if (url) {
            setImageUrl(url);
        }
    }, [url]);

    const handleZoomIn = () => {
        setScale(scale * 1.2);
    };

    const handleZoomOut = () => {
        setScale(scale / 1.2);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={handleZoomIn} style={{ marginRight: '10px' }}>Увеличить</button>
                <button onClick={handleZoomOut}>Уменьшить</button>
            </div>
            <img
                src={imageUrl}
                alt="Просмотр изображения"
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.25s ease',
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
};

export default ImageView;