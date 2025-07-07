import React, { useState, useRef, useEffect } from 'react';
import styles from './MediaUploader.module.css';

const MediaUploader = ({ content, onUpdate, style, className, mediaType = 'image'}) => {
    const [preview, setPreview] = useState(null);
    const [urlInput, setUrlInput] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const getEmbedVideoUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.replace('www.', '');
            
            const videoServices = {
                'youtube.com': {
                    id: parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop(),
                    embed: 'https://www.youtube.com/embed/{id}'
                },
                'youtu.be': {
                    id: parsedUrl.pathname.split('/').pop(),
                    embed: 'https://www.youtube.com/embed/{id}'
                },
                'rutube.ru': {
                    id: parsedUrl.pathname.split('/').filter(Boolean).pop(),
                    embed: 'https://rutube.ru/play/embed/{id}'
                },
                'vimeo.com': {
                    id: parsedUrl.pathname.split('/').pop(),
                    embed: 'https://player.vimeo.com/video/{id}'
                },
                'dailymotion.com': {
                    id: parsedUrl.pathname.split('/video/').pop().split('_')[0],
                    embed: 'https://www.dailymotion.com/embed/video/{id}'
                },
                'dai.ly': {
                    id: parsedUrl.pathname.split('/').pop(),
                    embed: 'https://www.dailymotion.com/embed/video/{id}'
                }
            };

            if (videoServices[hostname]) {
                const { id, embed } = videoServices[hostname];
                return embed.replace('{id}', id);
            }

            return null;
        } catch {
            return null;
        }
    };

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
            if (!urlInput.trim()) {
                setError('Введите URL');
                return;
            }

            let parsedUrl;
            try {
                parsedUrl = new URL(urlInput);
            } catch {
                if (mediaType === 'video') {
                    const testVideo = document.createElement('video');
                    testVideo.src = urlInput;
                    
                    await new Promise((resolve, reject) => {
                        testVideo.onloadeddata = resolve;
                        testVideo.onerror = () => reject(new Error('Ошибка загрузки видео'));
                    });
                    
                    setPreview(urlInput);
                    onUpdate?.(urlInput);
                    return;
                }
                throw new Error('Некорректный URL адрес');
            }

            if (mediaType === 'video') {
                const embedUrl = getEmbedVideoUrl(urlInput);
                if (embedUrl) {
                    setPreview(embedUrl);
                    onUpdate?.(embedUrl);
                    return;
                }
            }
            if (mediaType === 'image') {
                const testImage = new Image();
                testImage.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testImage.onload = resolve;
                    testImage.onerror = () => reject(new Error('Ошибка загрузки изображения'));
                });
            } else if (mediaType === 'audio') {
                const testAudio = new Audio();
                testAudio.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testAudio.onloadeddata = resolve;
                    testAudio.onerror = () => reject(new Error('Ошибка загрузки аудио'));
                });
            } else if (mediaType === 'video') {
                const testVideo = document.createElement('video');
                testVideo.src = urlInput;
                
                await new Promise((resolve, reject) => {
                    testVideo.onloadeddata = resolve;
                    testVideo.onerror = () => reject(new Error('Ошибка загрузки видео'));
                });
            }

            setPreview(urlInput);
            onUpdate?.(urlInput);
        } catch (err) {
            setError(err.message || 'Некорректный URL адрес или медиафайл не загружается');
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

        if (mediaType === 'video') {
            const embedUrl = getEmbedVideoUrl(preview);
            if (embedUrl) {
                return (
                    <iframe
                        src={embedUrl}
                        className={styles.previewMedia}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                );
            }
        }

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