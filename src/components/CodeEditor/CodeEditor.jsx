import {useState} from 'react';
import Editor from "./Editor/Editor";
import CompilerBar from "./CompilerBar/CompilerBar";
import ArgumentBar from "./ArgumentBar/ArgumentBar";
import CodeView from "./CodeView";
import LogViewer from "./LogViewer/LogViewer";
import styles from "./CodeEditor.module.css";

const CodeEditor = ({code, setCode, editable}) => {
    const [argValues, setArgValues] = useState(null);
    const [variables, setVariables] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const addLog = (str) => {
        setLogs(prev=> [...prev, str]);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    return (
        <div className={`${styles.workspace} ${isFullscreen && styles.fullscreen}`}>
            <CompilerBar code={code} argValues={argValues} setVariables={setVariables} setLog={addLog} isFullscreen={isFullscreen} onFullscreenClick={toggleFullscreen}/>
            <div className={styles.editorView}>
                {editable ? <Editor code={code} setCode={setCode} /> : <CodeView code={code}/>}
                
                <ArgumentBar variables={variables} setValues={setArgValues}/>
            </div>
            <LogViewer logs={logs}/>
        </div>
    )
}

export default CodeEditor;