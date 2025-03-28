import Modal from '../../Modal/Modal';
import ArrayView from './ArrayView/ArrayView';
import MatrixView from './MatrixView/MatrixView';
import ImageView from './ImageView/ImageView';

const FileView = ({open, onCloseClick, type, content}) => {
    const renderView = () => {
        switch (type) {
            case 'array':
                return <ArrayView filename={content}/>;
            case 'matrix':
                return <MatrixView filename={content}/>;
            case 'text':
                return <textarea readOnly value={content}/>;
            case 'image':
                return <ImageView url={content}/>;
            case 'audio':
                return <audio controls src={content}/>;
            case 'video':
                return <video controls src={content}/>
            default:
                return <div>Неизвестный тип</div>
        }
    }

    return (
        <Modal open={open} onCloseClick={onCloseClick}>
            {renderView()}
        </Modal>
    )
};

export default FileView;