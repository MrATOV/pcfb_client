import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonActions } from '../Lesson/useLessonActions';

const SubscribeLinkHandler = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const {fetchSubscribeToken} = useLessonActions();

    useEffect(() => {
        const processLink = async () => {
            fetchSubscribeToken(token);
        }
        processLink();
        navigate('/');
    }, [token, navigate]);

    return (
        <div>
            <p>Обработка...</p>
        </div>
    )
};

export default SubscribeLinkHandler;