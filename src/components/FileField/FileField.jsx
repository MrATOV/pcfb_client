import { useRef, useState, useEffect } from 'react'
import FileItem from './FileItem/FileItem';
import FileCreator from './FileCreator/FileCreator';
import FileView from './FileView/FileView';
import styles from './FileField.module.css';
import {useDataActions} from './useDataActions';

import arrayIcon from "/src/assets/files/array.svg";
import audioIcon from "/src/assets/files/audio.svg";
import imageIcon from "/src/assets/files/image.svg";
import matrixIcon from "/src/assets/files/matrix.svg";
import videoIcon from "/src/assets/files/video.svg";
import textIcon from "/src/assets/files/text.svg";
import nullIcon from "/src/assets/files/null.svg";
const dataTypes = {
    "array": arrayIcon,
    "matrix": matrixIcon,
    "text": textIcon,
    "image": imageIcon,
    "audio": audioIcon,
    "video": videoIcon
};

const FileField = ({selectItems, onSelectItems, type = 'all'}) => {
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewType, setViewType] = useState(null);
    const {
        dataList,
        dataContent,
        fetchLoadData, 
        fetchGetDataContent,
        fetchDeleteData, 
        fetchUploadFile,
        fetchGenerateData,
        fetchUploadText,
    } = useDataActions(type);

    useEffect(() => {
        fetchLoadData(type);
    }, []);

    const handleNewItemClick = (data) => {
        if ('file' in data) {
            fetchUploadFile(data);
        } else if ('params' in data) {
            fetchGenerateData(data);
        } else if ('textContent' in data) {
            fetchUploadText(data);
        }
        setCreatorOpen(false);
    }

    const handleItemClick = async (type, filename) => {
        setViewType(type);
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

    return (
        <div className={styles.field}>
            {dataList && dataList.map((file) => (
                <FileItem
                    key={file.id}
                    logo={dataTypes[file.type]}
                    onDeleteClick={() => fetchDeleteData(file.id)}
                    isSelect={ selectItems ? selectItems.includes(file.path) : false }
                    onSelectClick={onSelectItems ? () => handleSelectClick(file.path) : null}
                    onItemClick={() => handleItemClick(file.type, file.path)}
                >
                    {file.path}
                </FileItem>
            ))}
            <button className={styles.newItemButton} onClick={() => setCreatorOpen(true)}>+</button>
            <FileCreator open={creatorOpen} onYesClick={handleNewItemClick} onNoClick={()=> setCreatorOpen(false)}/>
            <FileView open={viewOpen} onCloseClick={() => setViewOpen(false)} type={viewType} content={dataContent}/>
        </div>
    )
}

export default FileField;