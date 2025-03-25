import React, { useState, useRef, useEffect } from 'react';
import styles from './MediaUploader.module.css';

const MediaUploader = ({ content, onUpdate, style, className, mediaType = 'image'}) => {
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
            if (!file.type.startsWith(`${mediaType}/`)) {
                setError(`Загрузите корректный файл ${getMediaTypeName(mediaType)}`);
                return;
            }

            try {
                const url = URL.createObjectURL(file);
                setPreview(url);
                onUpdate?.(file);
            } catch (err) {
                setError('Ошибка при создании URL медиафайла');
                setPreview(null);
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
            
            if (mediaType === 'image') {
                const testImage = new Image();
                testImage.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testImage.onload = resolve;
                    testImage.onerror = reject;
                });
            } else if (mediaType === 'audio') {
                const testAudio = new Audio();
                testAudio.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testAudio.onloadeddata = resolve;
                    testAudio.onerror = reject;
                });
            } else if (mediaType === 'video') {
                const testVideo = document.createElement('video');
                testVideo.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testVideo.onloadeddata = resolve;
                    testVideo.onerror = reject;
                });
            }

            setPreview(urlInput);
            onUpdate?.(urlInput);
        } catch (err) {
            setError('Некорректный URL адрес или медиафайл не загружается');
            setPreview(null);
        }
    };

    const getMediaTypeName = (type) => {
        switch(type) {
            case 'image': return 'изображения';
            case 'audio': return 'аудио';
            case 'video': return 'видео';
            default: return 'медиа';
        }
    };

    const renderPreview = () => {
        if (!preview) return <div>Нажмите для загрузки {getMediaTypeName(mediaType)} с ПК</div>;

        switch(mediaType) {
            case 'image':
                return (
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className={styles.previewMedia}
                        onError={() => {
                            setPreview(null);
                            setError('Ошибка в загрузке изображения');
                        }}
                    />
                );
            case 'audio':
                return (
                    <audio 
                        controls 
                        src={preview} 
                        className={styles.previewMedia}
                        onError={() => {
                            setPreview(null);
                            setError('Ошибка в загрузке аудио');
                        }}
                    />
                );
            case 'video':
                return (
                    <video 
                        controls 
                        src={preview} 
                        className={styles.previewMedia}
                        onError={() => {
                            setPreview(null);
                            setError('Ошибка в загрузке видео');
                        }}
                    />
                );
            default:
                return null;
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
                        placeholder={`Введите URL ${getMediaTypeName(mediaType)}`}
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
                {renderPreview()}
                
                <input
                    type="file"
                    accept={`${mediaType}/*`}
                    ref={inputRef}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>
        </div>
    );
};

export default MediaUploader;