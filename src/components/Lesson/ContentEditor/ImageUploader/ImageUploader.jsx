import React, { useState, useRef, useEffect } from 'react';
import styles from './ImageUploader.module.css';

const ImageUploader = ({ content, onUpdate, style, className }) => {
    const [preview, setPreview] = useState(null);
    const [urlInput, setUrlInput] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (content) {
            if (content instanceof File) {
                const url = URL.createObjectURL(content);
                setPreview(url);
            } else if (typeof content === 'string') {
                setPreview(content);
            }
        } else {
            setPreview(null);
        }
    }, [content]);

    useEffect(() => {
        return () => {
            if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {

                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleFileUpload = () => {
        inputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUrlInput('');
        setError('');
        
        if (file) {
            if (file.type.startsWith('image/')) {
                try {
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                    onUpdate?.(file);
                } catch (err) {
                    setError('Ошибка в создании URL изображения');
                    setPreview(null);
                }
            } else {

                setError('Загрузите корректный файл изображения');
            }
        }
    };

    const handleUrlSubmit = async () => {
        try {
            setError('');
            if (!urlInput) {
                return;
            }

            new URL(urlInput);
            
            const testImage = new Image();
            testImage.src = urlInput;
            
            await new Promise((resolve, reject) => {
                testImage.onload = resolve;
                testImage.onerror = reject;
            });

            setPreview(urlInput);
            onUpdate?.(urlInput);
        } catch (err) {
            setError('Некорректный URL адрес изображения');
            setPreview(null);
        }
    };

    return (
        <div 
            style={style}
            className={`${styles.container} ${className}`}
        >
            <div className={styles.urlSection}>
                <div className={styles.urlInputContainer}>
                    <input
                        type="text"
                        placeholder="Введите URL изображения"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className={styles.urlInput}
                    />
                    <button 
                        onClick={handleUrlSubmit}
                        className={styles.urlButton}
                    >
                        Загрузить
                    </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.divider}>
                <span className={styles.dividerText}>или</span>
                <div className={styles.dividerLine}></div>
            </div>

            <div 
                onClick={handleFileUpload}
                className={styles.uploadSection}
            >
                {preview ? (
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className={styles.previewImage}
                        onError={() => {
                            setPreview(null);
                            setError('Ошибка в загрузке изображения');
                        }}
                    />
                ) : (
                    <div>Нажмите для загрузки изображения с ПК</div>
                )}
                
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>
        </div>
    );
};

export default ImageUploader;