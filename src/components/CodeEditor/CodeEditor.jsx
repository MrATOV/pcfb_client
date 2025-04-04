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

const CodeEditor = ({code, setCode, editable}) => {
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
    const triggerRef = useRef(null);

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
    }, []);

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
    }

    return (
        <div className={`${styles.workspace} ${isFullscreen && styles.fullscreen}`}>
            <CompilerBar
                task_id={taskId}
                task_type={taskType}
                user_id={protectedData.id} 
                code={code} 
                onGenerateClick={() => setGeneratorOpen(true)} 
                argValues={argValues} 
                setVariables={setVariables} 
                setLog={addLog} 
                isFullscreen={isFullscreen} 
                onFullscreenClick={toggleFullscreen}
                infoRef={triggerRef}
                onInfoClick={() => setInfoOpen(true)}
            />
            <div className={styles.editorView}>
                {editable ? <Editor code={code} setCode={setCode} /> : <CodeView code={code}/>}
                
                <ArgumentBar variables={variables} setValues={setArgValues}/>
            </div>
            <LogViewer logs={logs}/>
            <TestPanel threadNumber={threadNum} code={code} open={generatorOpen} onNoClick={() => setGeneratorOpen(false)} onYesClick={handleGenerateClick}/>
            <DropdownMenu 
                style={{top: "44px", left: "260px"}}
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