import Modal from '../../Modal/Modal';
import ArrayView from './ArrayView/ArrayView';
import MatrixView from './MatrixView/MatrixView';
import ImageView from './ImageView/ImageView';
import styles from './FileView.module.css';

const FileView = ({open, onCloseClick, data, content, path = 'default'}) => {
    console.log(data);
    const renderView = () => {
        switch (data?.type) {
            case 'array':
                return <ArrayView filename={content} path={path}/>;
            case 'matrix':
                return <MatrixView filename={content} path={path}/>;
            case 'text':
                return <textarea className={styles.text} readOnly value={content}/>;
            case 'image':
                return <ImageView url={content}/>;
            case 'audio':
                return <audio className={styles.audio} controls src={content}/>;
            case 'video':
                return <video controls src={content}/>
            default:
                return <div>Неизвестный тип</div>
        }
    }

    return (
        <Modal className={styles.modal} open={open} onCloseClick={onCloseClick}>
            <h1>{data?.title || "Неизвестный файл"}</h1>
            {renderView()}
        </Modal>
    )
};

export default FileView;