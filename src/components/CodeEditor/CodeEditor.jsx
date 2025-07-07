import {useState, useContext, useEffect, useRef} from 'react';
import {Context} from '/src/Context';
import Editor from "./Editor/Editor";
import CompilerBar from "./CompilerBar/CompilerBar";
import ArgumentBar from "./ArgumentBar/ArgumentBar";
import CodeView from "./CodeView";
import LogViewer from "./LogViewer/LogViewer";
import styles from "./CodeEditor.module.css";
import TestPanel from '../TestPanel/TestPanel';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import MarkdownView from '../Lesson/ContentBlock/MarkdownView/MarkdownView';
import axios from '/src/config/axiosCompilerConfig';
import SourceList from './SourceList/SourceList';
import Dialog from '../Dialog/Dialog';
import {useCodeActions} from './useCodeActions';
import {toast} from '/src/toast';

const CodeEditor = ({code, setCode, editable, teacherId}) => {
    const [argValues, setArgValues] = useState(null);
    const [variables, setVariables] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { protectedData } = useContext(Context);
    const [generatorOpen, setGeneratorOpen] = useState(false);
    const taskId = sessionStorage.getItem('oneTimeTaskId');
    const taskType = sessionStorage.getItem('oneTimeTaskType');
    const [threadNum, setThreadNum] = useState(1);
    const [info, setInfo] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [filename, setFilename] = useState('main.cpp');
    const [currentFileId, setCurrentFileId] = useState(null);
    const [filter, setFilter] = useState("");
    const [disableSave, setDisableSave] = useState(true);
    const [openDialogChangeFile, setOpenDialogChangeFile] = useState({
        open: false,
        id: 0
    });
    const triggerRef = useRef(null);
    const { 
        codeList, 
        fetchSaveNewCode, 
        fetchGetCodeList, 
        fetchDeleteCodeFile,
        fetchGetSourceCode,
        fetchChangeCode,
    } = useCodeActions();

    useEffect(() => {
        const fetchProcessorInfo = async () => {
            try {
                const response = await axios.get('/system');
                setThreadNum(response.data.physical_cores);
                setInfo(
                    `* Компилятор - \`${response.data.compiler}\`\n` +
                    `* Версия языка - \`${response.data.language_version}\`\n` +
                    `* Процессор - \`${response.data.processor_name}\`. Количество ядер - \`${response.data.physical_cores}\`\n`
                    )
            } catch (error) {
                console.error("Error load processor info", error);
            }
        };
        fetchProcessorInfo();
        fetchGetCodeList(filter);
    }, []);

    useEffect(() => {
        fetchGetCodeList(filter);
    }, [filter]);

    useEffect(() => {
        if (taskId) {
            sessionStorage.removeItem("oneTimeTaskId");
        }
        if (taskType) {
            sessionStorage.removeItem("oneTimeTaskType");
        }
    }, [taskId, taskType]);

    const addLog = (str) => {
        setLogs(prev=> [...prev, str]);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    const handleGenerateClick = async (data) => {
        setGeneratorOpen(false);
        setCode(`${data.include}\n${code}\n${data.main}`)
        setDisableSave(false);
    }

    const handleSaveClick = async () => {
        if (currentFileId) {
            const status = await fetchChangeCode(code, filename, filter);
            if (status) {
                setDisableSave(true);
                toast.info(`Содержимое файла ${filename} успешно обновлено.`);
            } else {
                toast.error(`Не удалось обновить файл ${filename}.`);
            }
        } else {
            const newId = await fetchSaveNewCode(code, filename, filter);
            if (newId) {
                setDisableSave(true);
                toast.info(`Файл ${filename} успешно сохранен.`);
                await handleSelectCodeClick(newId);
            } else {
                toast.error(`Не удалось сохранить файл ${filename}.`);
            }
        }
    }

    const handleSelectCode = async (index) => {
        if (disableSave) {
            await handleSelectCodeClick(index);
        } else {
            setOpenDialogChangeFile({
                open: true,
                id: index
            })
        }
    }

    const handleSelectCodeClick = async (index) => {
        setCurrentFileId(index);
        setFilename(codeList.find(item => item.id === index).path);
        const newCode = await fetchGetSourceCode(index);
        setCode(newCode);
        setDisableSave(true);
        setOpenDialogChangeFile({
            open: false,
            id: 0
        });
    }
    
    const handleAddNewFileClick = async () => {
        setCurrentFileId(null);
        setFilename("Новый файл.cpp");
        setCode("// Новый файл.cpp\n");
        setDisableSave(false);
    }

    const handleDeleteFile = async (index) => {
        if (currentFileId && currentFileId === index) {
            if (codeList.length > 1) {
                await handleSelectCodeClick(codeList[codeList.length - 2].id);
            } else {
                handleAddNewFileClick();
            }
        }
        await fetchDeleteCodeFile(index, filter);
    }

    return (
        <div className={`${styles.workspace} ${isFullscreen && styles.fullscreen}`}>
            <CompilerBar
                task_id={taskId}
                task_type={taskType}
                user_id={protectedData ? protectedData.id : teacherId} 
                code={code}
                setCode={setCode}
                filename={filename}
                setFilename={setFilename}
                onGenerateClick={() => setGeneratorOpen(true)} 
                argValues={argValues} 
                setVariables={setVariables} 
                setLog={addLog} 
                isFullscreen={isFullscreen} 
                onFullscreenClick={toggleFullscreen}
                infoRef={triggerRef}
                onInfoClick={() => setInfoOpen(true)}
                onSaveCode={handleSaveClick}
                onNewFileClick={handleAddNewFileClick}
                disableSave={disableSave}
            />
            <div className={styles.editorView}>
                {editable ? 
                <>
                    <SourceList 
                        data={codeList}
                        currentId={currentFileId}
                        filter={filter}
                        onFilter={setFilter}
                        onFileClick={handleSelectCode}
                        onFileDelete={handleDeleteFile}
                    />
                    <Editor code={code} setCode={setCode} onDisableSave={() => setDisableSave(false)}/>
                </> : 
                <CodeView code={code}/>}
                <ArgumentBar variables={variables} setValues={setArgValues}/>
            </div>
            <LogViewer logs={logs}/>
            <TestPanel threadNumber={threadNum} code={code} open={generatorOpen} onNoClick={() => setGeneratorOpen(false)} onYesClick={handleGenerateClick}/>
            <Dialog open={openDialogChangeFile.open} onNoClick={() => setOpenDialogChangeFile({open: false, id: 0})} onYesClick={() => handleSelectCodeClick(openDialogChangeFile.id)}>
                <p>При открытии файла все несохраненные данные будут удалены. Хотите открыть другой файл?</p>
            </Dialog>
            <DropdownMenu 
                style={{top: "44px", right: "150px"}}
                isOpen={infoOpen} 
                onClose={() => setInfoOpen(false)}
                triggerRef={triggerRef}
            >
                <h2>Информация о системе</h2>
                <MarkdownView content={info}/>
            </DropdownMenu>
        </div>
    )
}

export default CodeEditor;