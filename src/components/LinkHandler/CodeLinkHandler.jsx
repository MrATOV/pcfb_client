import { useParams, Navigate } from 'react-router-dom';

const CodeLinkHandler = () => {
    const {type, taskId} = useParams();
    
    if (type && taskId) {
        sessionStorage.setItem("oneTimeTaskType", type);
        sessionStorage.setItem("oneTimeTaskId", taskId);
    }

    return <Navigate to="/code" replace/>
};

export default CodeLinkHandler;