import Modal from '../../Modal/Modal';
import MarkdownView from '../../Lesson/ContentBlock/MarkdownView/MarkdownView';
import {content} from './DocumentationText';
import styles from './Documentation.module.css';
import {useState} from 'react';

const Documentation = ({open, onClose}) => {
    const [classDoc, setClassDoc] = useState("TestFunctions");
    return (
        <Modal style={{width: "70vw", height: "90vh", overflow: "hidden"}} open={open} onCloseClick={onClose}>
            <div className={styles.buttons}>
                <button className={classDoc === 'TestFunctions' ? styles.active : ""} onClick={() => setClassDoc("TestFunctions")}>TestFunctions</button>
                <button className={classDoc === 'TestOptions' ? styles.active : ""} onClick={() => setClassDoc("TestOptions")}>TestOptions</button>
                <button className={classDoc === 'DataManager' ? styles.active : ""} onClick={() => setClassDoc("DataManager")}>DataManager</button>
                <button className={classDoc === 'FunctionManager' ? styles.active : ""} onClick={() => setClassDoc("FunctionManager")}>FunctionManager</button>
            </div>
            <MarkdownView className={styles.content} content={content(classDoc)}/>
        </Modal>
    );
};

export default Documentation;