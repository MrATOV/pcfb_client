import {useState, useContext, useEffect, useRef } from "react";
import {Context} from '/src/Context';
import axios from "../../../config/axiosCompilerConfig";
import styles from "./CompilerBar.module.css"
import TestResult from '../../TestResult/TestResult';
import Modal from '../../Modal/Modal';
import MarkdownView from '../../Lesson/ContentBlock/MarkdownView/MarkdownView';

import fullscreenIcon from '/src/assets/icons/fullscreen.svg';
import windowedIcon from '/src/assets/icons/windowed.svg';
import compileIcon from '/src/assets/icons/compile.svg';
import executeIcon from '/src/assets/icons/execute.svg';
import testIcon from '/src/assets/icons/test.svg';
import stopIcon from '/src/assets/icons/stop.svg';
import generateIcon from '/src/assets/icons/generate.svg';

import fullscreenIconDark from '/src/assets/icons/dark/fullscreen.svg';
import windowedIconDark from '/src/assets/icons/dark/windowed.svg';
import compileIconDark from '/src/assets/icons/dark/compile.svg';
import executeIconDark from '/src/assets/icons/dark/execute.svg';
import testIconDark from '/src/assets/icons/dark/test.svg';
import stopIconDark from '/src/assets/icons/dark/stop.svg';
import generateIconDark from '/src/assets/icons/dark/generate.svg';

const CompilerBar = ({task_id, task_type, user_id, code, onGenerateClick, argValues, setVariables, setLog,  isFullscreen, onFullscreenClick, onInfoClick, infoRef}) => {
    const [taskId, setTaskId] = useState(task_id);
    const [fileId, setFileId] = useState(null);
    const {isDark} = useContext(Context);
    const [canTest, setCanTest] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [resultData, setResultData] = useState(null);
    const intervalRef = useRef(null);
    const [activeTaskType, setActiveTaskType] = useState(task_type);
    const [manualOpen, setManualOpen] = useState(false);
    
    const date = () => {
        const now = new Date();
        return now.toLocaleString('ru-RU');
    };

    const checkTaskStatus = async (currentTaskId) => {
        if (!currentTaskId || !activeTaskType) return true;
        try {
            const response = await axios.get(`/task/${currentTaskId}/status`);
            const statusData = response.data;
            console.log(statusData);
            if (statusData.status === 'SUCCESS') {
                const result = statusData.result;
                console.log(activeTaskType);
                if (activeTaskType === 'compile') {
                    setFileId(result.file_id);
                    setVariables(result.stdout?.variables || {});
                    setCanTest(!!result.stdout?.can_test);

                    
                    setLog(`[${date()} SERVER]:\n${result.message}`);
                    if (result.stderr) setLog(`[${date()} ERROR]:\n${result.stderr}`);
                }
                else if (activeTaskType === 'execute' || activeTaskType === 'test_execution') {
                    setLog(`[${date()} SERVER]:\n${result.message}`);
                    if (result.stdout) setLog(`[${date()} OUT]:\n${result.stdout}`);
                    if (result.stderr) setLog(`[${date()} ERROR]:\n${result.stderr}`);

                    if (activeTaskType === 'test_execution' && result.result) {
                        setResultData(result.result);
                        setResultOpen(true);
                    }
                }

                if (statusData.requires_acknowledgment) {
                    await axios.post(`/task/${currentTaskId}/acknowledge`, {user_id});
                }

                setActiveTaskType(null);
                setTaskId(null);
                return true;
            } else if (statusData.status === 'FAILURE') {
                setLog(`[${date()} ERROR]: Task failed`);
                setActiveTaskType(null);
                setTaskId(null);
                return true;
            }
            return false;
        } catch (error) {
            setLog(`[${date()} ERROR]: Task failed`);
            console.error("Status check error:", error);
            setActiveTaskType(null);
            setTaskId(null);
            return true;
        }
    };

    useEffect(() => {
        if (!taskId || !activeTaskType) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(async () => {
            const isCompleted = await checkTaskStatus(taskId);
            if (isCompleted && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(interval);
            }
        };
    }, [taskId, activeTaskType]);

    const handleCompileClick = async () => {
        try {
            const response = await axios.post('/compile', {
                code: code,
                user_id: user_id
            });

            setTaskId(response.data.task_id);
            setActiveTaskType('compile');
            setLog(`[${date()} SERVER]: Запущен процесс сборки`);
        } catch (error) {
            console.error("Compile error:", error);
            setLog(`[${date()} ERROR]: ${error.message}`);
        }
    }

    const handleExecuteClick = async () => {
        if (!fileId) {
            setLog(`[${date()} ERROR]: Сначала необходимо собрать проект`);
            return;
        }

        try {
            const response = await axios.post(`/execute/${fileId}`, {
                user_id: user_id,
                input_data: argValues ? Object.values(argValues).join('\n') : ""
            });

            setTaskId(response.data.task_id);
            setActiveTaskType('execute');
            setLog(`[${date()} SERVER]: Исполняемый файл запущен`);
        } catch (error) {
            console.error("Execute error:", error);
            setLog(`[${date()} ERROR]: ${error.message}`);
        }
    };
    
    const handleTestClick = async () => {
        if (!fileId) {
            setLog(`[${date()} ERROR]: Сначала необходимо собрать проект`);
            return;
        }

        try {
            const response = await axios.post(`/test/${fileId}`, {
                user_id: user_id,
                input_data: argValues ? Object.values(argValues).join('\n') : ""
            });
            setTaskId(response.data.task_id);
            setActiveTaskType('test_execution');
            setLog(`[${date()} SERVER]: Запущен процесс тестирования`);

        } catch (error) {
            console.error("Execute error:", error);
            setLog(`[ERROR]: ${error.message}`);
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
            <button ref={infoRef} className={styles.buttonManual} title="Информация" onClick={onInfoClick}>
                i
            </button>
            <button title="Сгенерировать" onClick={onGenerateClick}>
                <img src={isDark ? generateIconDark : generateIcon } alt=""/>
            </button>
            <button className={styles.buttonManual} title="Документация" onClick={() => setManualOpen(true)}>
                ?
            </button>
            <button style={{marginLeft: "auto"}} title={isFullscreen ? "Оконный режим" : "Полный экран" } onClick={onFullscreenClick}>
                {isFullscreen ? <img src={isDark ? windowedIconDark : windowedIcon } alt=""/> : <img src={isDark ? fullscreenIconDark : fullscreenIcon } alt=""/>}
            </button>
            <TestResult open={resultOpen} onCloseClick={() => setResultOpen(false)} data={resultData}/>
            <Modal open={manualOpen} onCloseClick={() => setManualOpen(false)}>
                <MarkdownView content={"# Потом добавить"}/>
            </Modal>
        </div>
    ) 
}

export default CompilerBar;