import {useState, useContext} from 'react';
import {Context} from '/src/Context';
import Editor from "./Editor/Editor";
import CompilerBar from "./CompilerBar/CompilerBar";
import ArgumentBar from "./ArgumentBar/ArgumentBar";
import CodeView from "./CodeView";
import LogViewer from "./LogViewer/LogViewer";
import styles from "./CodeEditor.module.css";
import TestPanel from '../TestPanel/TestPanel';

const CodeEditor = ({code, setCode, editable}) => {
    const [argValues, setArgValues] = useState(null);
    const [variables, setVariables] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { protectedData } = useContext(Context);
    const [generatorOpen, setGeneratorOpen] = useState(false);

    const addLog = (str) => {
        setLogs(prev=> [...prev, str]);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    const handleGenerateClick = async (data) => {
        console.log(data);
        setGeneratorOpen(false);
        setCode(`${data.include}\n${code}\n${data.main}`)
    }

    return (
        <div className={`${styles.workspace} ${isFullscreen && styles.fullscreen}`}>
            <CompilerBar 
                user_id={protectedData.id} 
                code={code} 
                onGenerateClick={() => setGeneratorOpen(true)} 
                argValues={argValues} 
                setVariables={setVariables} 
                setLog={addLog} 
                isFullscreen={isFullscreen} 
                onFullscreenClick={toggleFullscreen}
            />
            <div className={styles.editorView}>
                {editable ? <Editor code={code} setCode={setCode} /> : <CodeView code={code}/>}
                
                <ArgumentBar variables={variables} setValues={setArgValues}/>
            </div>
            <LogViewer logs={logs}/>
            <TestPanel code={code} open={generatorOpen} onNoClick={() => setGeneratorOpen(false)} onYesClick={handleGenerateClick}/>
        </div>
    )
}

export default CodeEditor;