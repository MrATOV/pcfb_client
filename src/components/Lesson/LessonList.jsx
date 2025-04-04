import LessonTab from './LessonTab/LessonTab';
import LessonTabSubscript from './LessonTab/LessonTabSubscript';
import { useNavigate } from 'react-router-dom';

const LessonList = ({role}) => {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{display: 'flex'}}>
                <button onClick={() => navigate('/code')}>Редактор</button>
                <button onClick={() => navigate('/lessons')}>Все уроки</button>
                <button onClick={() => navigate('/data')}>Данные</button>
                <button onClick={() => navigate('/results')}>Результаты</button>
            </div>
            {role === 'teacher' && <LessonTab role={role}/>}
            <LessonTabSubscript/>
        </div>
    )
};

export default LessonList;