import {useState, useContext } from "react";
import {Context} from '/src/Context';
import axios from "../../../config/axiosCompilerConfig";
import styles from "./CompilerBar.module.css"
import TestResult from '../../TestResult/TestResult';

import fullscreenIcon from '/src/assets/icons/fullscreen.svg';
import windowedIcon from '/src/assets/icons/windowed.svg';
import compileIcon from '/src/assets/icons/compile.svg';
import executeIcon from '/src/assets/icons/execute.svg';
import testIcon from '/src/assets/icons/test.svg';
import stopIcon from '/src/assets/icons/stop.svg';
import generateIcon from '/src/assets/icons/generate.svg';
import TestPanel from "../../TestPanel/TestPanel";

import fullscreenIconDark from '/src/assets/icons/dark/fullscreen.svg';
import windowedIconDark from '/src/assets/icons/dark/windowed.svg';
import compileIconDark from '/src/assets/icons/dark/compile.svg';
import executeIconDark from '/src/assets/icons/dark/execute.svg';
import testIconDark from '/src/assets/icons/dark/test.svg';
import stopIconDark from '/src/assets/icons/dark/stop.svg';
import generateIconDark from '/src/assets/icons/dark/generate.svg';

const CompilerBar = ({user_id, code, onGenerateClick, argValues, setVariables, setLog,  isFullscreen, onFullscreenClick}) => {
    const [fileId, setFileId] = useState(null);
    const {isDark} = useContext(Context);
    const [canTest, setCanTest] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [resultData, setResultData] = useState(null);

    const handleCompileClick = async () => {
        try {
            const data = {
                "user_id": user_id,
                "code": code
            }
            const response = await axios.post('/compile', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const rd = response.data;
            setFileId(rd.file_id);
            setVariables(rd.stdout.variables);
            if (rd.stdout.cat_test) {
                setCanTest(true);
            } else {
                setCanTest(false);
            }
            const now = new Date();
            const date = now.toLocaleString('ru-RU');
            setLog(`[${date} SERVER]:\n${rd.message}`);
            if (rd.stderr !== "") setLog(`[${date} ERROR]:\n${rd.stderr}`);
        } catch (error) {
            console.error("Compile error:", error);
        }
    }

    const handleExecuteClick = async () => {
        try {
            const data = {
                "user_id": user_id,
                "input_data": argValues ? Object.values(argValues).join('\n') : ""
            }
            
            const response = await axios.post(`/execute/${fileId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            const rd = response.data;
            const now = new Date();
            const date = now.toLocaleString('ru-RU');
            setLog(`[${date} SERVER]:\n${rd.message}`);
            if (rd.stdout !== "") setLog(`[${date} OUT]:\n${rd.stdout}`);
            if (rd.stderr !== "") setLog(`[${date} ERROR]:\n${rd.stderr}`);
        } catch (error) {
            console.error("Execute error:", error);
        }
    }
    
    const handleTestClick = async () => {
        try {
            const data = {
                "user_id": user_id,
                "input_data": argValues ? Object.values(argValues).join('\n') : ""
            }
            
            const response = await axios.post(`/test/${fileId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const rd = response.data;
            if (rd.result) {
                console.log(rd.result);
                setResultData(rd.result);
                setResultOpen(true);
            }
            const now = new Date();
            const date = now.toLocaleString('ru-RU');
            setLog(`[${date} SERVER]:\n${rd.message}`);
            if (rd.stdout !== "") setLog(`[${date} OUT]:\n${rd.stdout}`);
            if (rd.stderr !== "") setLog(`[${date} ERROR]:\n${rd.stderr}`);
        } catch (error) {
            console.error("Execute error:", error);
        }
    }

    const handleCancelClick = async () => {
        try {
            const response = await axios.post(`/cancel/${fileId}`);
            console.log(response);
        } catch (error) {
            console.error("Cancer error:", error);
        }
    }
    
    return (
        <div className={styles.bar}>
            <button title="Сборка" onClick={handleCompileClick}>
                <img src={isDark ? compileIconDark : compileIcon} alt=""/>
            </button>
            <button title="Выполнить" disabled={fileId ? false : true} onClick={handleExecuteClick}>
                <img src={isDark ? executeIconDark : executeIcon } alt=""/>
            </button>
            <button title="Протестировать" disabled={fileId && canTest ? false : true} onClick={handleTestClick}>
                <img src={isDark ? testIconDark : testIcon } alt=""/>
            </button>
            <button title="Отмена" onClick={handleCancelClick}>
                <img src={isDark ? stopIconDark : stopIcon } alt=""/>
            </button>
            <button title="Сгенерировать" onClick={onGenerateClick}>
                <img src={isDark ? generateIconDark : generateIcon } alt=""/>
            </button>
            <button style={{marginLeft: "auto"}} title={isFullscreen ? "Оконный режим" : "Полный экран" } onClick={onFullscreenClick}>
                {isFullscreen ? <img src={isDark ? windowedIconDark : windowedIcon } alt=""/> : <img src={isDark ? fullscreenIconDark : fullscreenIcon } alt=""/>}
            </button>
            <TestResult open={resultOpen} onCloseClick={() => setResultOpen(false)} data={resultData}/>
        </div>
    ) 
}

export default CompilerBar;