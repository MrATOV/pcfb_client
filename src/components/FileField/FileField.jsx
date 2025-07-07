import { useRef, useState, useEffect } from 'react'
import FileItem from './FileItem/FileItem';
import FileCreator from './FileCreator/FileCreator';
import FileView from './FileView/FileView';
import styles from './FileField.module.css';
import {useDataActions} from './useDataActions';
import Paginator from '../Paginator/Paginator';

import arrayIcon from "/src/assets/files/array.svg";
import audioIcon from "/src/assets/files/audio.svg";
import imageIcon from "/src/assets/files/image.svg";
import matrixIcon from "/src/assets/files/matrix.svg";
import videoIcon from "/src/assets/files/video.svg";
import textIcon from "/src/assets/files/text.svg";
import nullIcon from "/src/assets/files/null.svg";
import gridIcon from '/src/assets/field_icons/grid.svg';
import tableIcon from '/src/assets/field_icons/table.svg';
import addFileIcon from '/src/assets/field_icons/add_file.svg';

const dataTypes = {
    "array": arrayIcon,
    "matrix": matrixIcon,
    "text": textIcon,
    "image": imageIcon,
    "audio": audioIcon,
    "video": videoIcon,
};

const dataTitles = {
    "array": "Массив",
    "matrix": "Матрица",
    "text": "Текст",
    "image": "Изображение",
    "audio": "Аудио",
    "video": "Видео",
};

const FileField = ({selectItems, onSelectItems, style, type = 'all'}) => {
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [filterType, setFilterType] = useState(type);
    const [filterName, setFilterName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [viewMode, setViewMode] = useState('grid');
    const {
        dataList,
        dataContent,
        dataCount,
        fetchLoadData, 
        fetchGetDataContent,
        fetchDeleteData, 
        fetchUploadFile,
        fetchGenerateData,
        fetchUploadText,
    } = useDataActions(type);

    console.log(type);

    useEffect(() => {
        fetchLoadData(filterType, filterName, dataCount, currentPage, pageSize);
    }, [currentPage, type]);

    useEffect(() => {
        fetchLoadData(filterType, filterName, null, currentPage, pageSize);
    }, [filterType, filterName, pageSize, type]);

    const handleNewItemClick = (data) => {
        if ('file' in data) {
            fetchUploadFile(data, filterType, filterName, currentPage, pageSize);
        } else if ('params' in data) {
            fetchGenerateData(data, filterType, filterName, currentPage, pageSize);
        } else if ('textContent' in data) {
            fetchUploadText(data, filterType, filterName, currentPage, pageSize);
        }
        setCreatorOpen(false);
    }

    const handleItemClick = async (type, filename) => {
        setViewData({type: type, title: filename});
        await fetchGetDataContent(type, filename);
        setViewOpen(true);
    }

    const handleSelectClick = (filename) => {
        onSelectItems(prev => {
            if (prev.includes(filename)) {
                return prev.filter(name => name !== filename);
            } else {
                return [...prev, filename];
            }
        });
    }

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
    };

    const totalPages = Math.ceil(dataCount / pageSize) || 1;

    return (
        <div className={styles.container} style={style}>
            <div className={styles.panel}>
                <select value={filterType} onChange={handleFilterTypeChange}>
                    <option value={'all'}>Все</option>
                    <option value={'array'}>Массив</option>
                    <option value={'matrix'}>Матрица</option>
                    <option value={'text'}>Текст</option>
                    <option value={'image'}>Изображение</option>
                    <option value={'audio'}>Аудио</option>
                    <option value={'video'}>Видео</option>
                </select>
                <input type="text" placeholder="Поиск по имени" value={filterName} onChange={(e) => setFilterName(e.target.value)}/>
                <button className={styles.viewMode} title="Режим отображения" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
                    <img src={viewMode === 'table' ? gridIcon : tableIcon} alt="view"/>
                </button>
                <button title="Добавить файл" onClick={() => setCreatorOpen(true)}>
                    <img src={addFileIcon} alt=""/>
                </button>
                <Paginator 
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalPages={totalPages}
                />
            </div>
            <div className={viewMode === 'grid' ? styles.gridContainer : styles.tableContainer}>
                {dataList && dataList.map((file) => (
                    <FileItem
                        key={file.id}
                        logo={dataTypes[file.type]}
                        onDeleteClick={() => fetchDeleteData(file.id)}
                        isSelect={ selectItems ? selectItems.includes(file.path) : false }
                        onSelectClick={onSelectItems ? () => handleSelectClick(file.path) : null}
                        onItemClick={() => handleItemClick(file.type, file.path)}
                        viewMode={viewMode}
                        title={file.path}
                        type={dataTitles[file.type]}
                    />
                ))}
            </div>
            <FileCreator open={creatorOpen} onYesClick={handleNewItemClick} onNoClick={()=> setCreatorOpen(false)}/>
            <FileView open={viewOpen} onCloseClick={() => setViewOpen(false)} data={viewData} content={dataContent}/>
        </div>
    )
}

export default FileField;