import { useState, useRef } from 'react';
import DataGenerator from './DataGenerator/DataGenerator';
import Dialog from '../../Dialog/Dialog';
import styles from './FileCreator.module.css';
import {useDataActions} from '../useDataActions';


const dataTypes = {
    array: { title: "массива", previewText: "Бинарный файл, содержащий массив", extension: ".array" },
    matrix: { title: "матрицы", previewText: "Бинарный файл, содержащий матрицу", extension: ".matrix" },
    text: { title: "текста", previewText: "Текстовый файл", extension: ".txt" },
    image: { title: "изображения", mediaType: "image" },
    audio: { title: "аудио", mediaType: "audio" },
    video: { title: "видео", mediaType: "video" }
};

const FileUploader = ({ open, onNoClick, onYesClick }) => {
    const [params, setParams] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [dataType, setDataType] = useState('array');
    const [file, setFile] = useState(null);
    const [textContent, setTextContent] = useState('Текст');
    const [filename, setFilename] = useState('Новый файл');
    const inputRef = useRef();

    const handleFileUpload = () => inputRef.current.click();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const mediaType = dataTypes[dataType]?.mediaType;
        
        if (['array', 'matrix', 'text'].includes(dataType)) {
            const extension = dataTypes[dataType].extension;
            if (!selectedFile.name.endsWith(extension)) {
                setError(`Файл должен иметь расширение ${extension}`);
                return;
            }
        }
        
        if (mediaType && !selectedFile.type.startsWith(`${mediaType}/`)) {
            setError(`Загрузите корректный файл ${dataTypes[dataType].title}`);
            return;
        }

        try {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        } catch (err) {
            setError(`Ошибка при создании URL ${dataTypes[dataType].title}`);
            setPreview(null);
            setFile(null);
        }
    };

    const renderMediaPreview = () => {
        const mediaProps = {
            src: preview,
            className: styles.previewMedia,
            onError: () => {
                setPreview(null);
                setFile(null);
                setError(`Ошибка в загрузке ${dataTypes[dataType].title}`);
            }
        };

        switch(dataType) {
            case 'image': return <img alt="Preview" {...mediaProps} />;
            case 'audio': return <audio controls {...mediaProps} />;
            case 'video': return <video controls {...mediaProps} />;
            default: return null;
        }
    };

    const renderPreview = () => {
        if (!preview) return <div>Нажмите для загрузки {dataTypes[dataType]?.title}</div>;
        
        if (['array', 'matrix', 'text'].includes(dataType)) {
            return <span>{dataTypes[dataType].previewText}</span>;
        }
        
        return renderMediaPreview();
    };

    const handleGenerate = () => {
        const data = {type: dataType};
        if (file) {
            data.file = file;
        }
        else if (['array', 'matrix'].includes(dataType) && params) {
            data.params = params;
            data.filename = filename;
        }
        else if (dataType === 'text' && textContent) {
            data.textContent = textContent;
            data.filename = filename;
        } else {
            return;
        }
        
        onYesClick(data);
    };

    return (
        <Dialog style={{ width: "25vw" }} open={open} onNoClick={onNoClick} onYesClick={handleGenerate}>
            <div className={styles.buttons}>
                {Object.keys(dataTypes).map(type => (
                    <button
                        key={type}
                        className={dataType === type ? styles.active : ""}
                        onClick={() => {
                            setDataType(type);
                            setPreview(null);
                            setFile(null);
                            setError(null);
                        }}
                    >
                        {dataTypes[type].title}
                    </button>
                ))}
            </div>
            
            <div onClick={handleFileUpload} className={styles.uploadSection}>
                {renderPreview()}
                <input 
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    accept={dataTypes[dataType]?.mediaType ? `${dataTypes[dataType].mediaType}/*` : dataTypes[dataType]?.extension}
                />
            </div>
            
            {error && <div className={styles.error}>{error}</div>}

            {["array", "matrix"].includes(dataType) && (
                <>
                    <input className={styles.filenameInput} type="text" value={filename} onChange={(e) => setFilename(e.target.value)}/>
                    <DataGenerator type={dataType} onParamsChange={setParams}/>
                </>
            )}
            
            {dataType === 'text' && (
                <>
                    <input className={styles.filenameInput} type="text" value={filename} onChange={(e) => setFilename(e.target.value)}/>
                    <textarea 
                        className={styles.textInput}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                    />
                </>
            )}
        </Dialog>
    );
};

export default FileUploader;