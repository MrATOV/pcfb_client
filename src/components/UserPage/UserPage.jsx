import LessonList from '../Lesson/LessonList';
import styles from './UserPage.module.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '/src/Context';
import userLogo from '/src/assets/user.svg';
import Modal from '../Modal/Modal';
import UserEdit from './UserEdit/UserEdit';

const UserPage = () => {
    const [editOpen, setEditOpen] = useState(false);
    const { protectedData, fetchProtectedData } = useContext(Context);
    const navigate = useNavigate();
    
    const handleEditClose = async () => {
        await fetchProtectedData();
        setEditOpen(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.userPanel}>
                <img src={protectedData.avatar ? protectedData.avatar : userLogo}/>
                <h1>{protectedData.username}</h1>
                <h3>{protectedData.role === 'teacher' ? "Преподаватель" : "Обучающийся"}</h3>
                <button onClick={() => setEditOpen(true)}>Редактировать</button>
                {protectedData.role === 'student' && <>
                    <button onClick={() => navigate('/data')}>Исходные данные</button>
                    <button onClick={() => navigate('/code')}>Редактор</button>
                    <button onClick={() => navigate('/results')}>Результаты тестов</button>
                </>}
                {protectedData.role === 'teacher' && <button onClick={() => navigate('/students')}>Обучающиеся</button>}
            </div>
            <LessonList role={protectedData.role}/>
            <Modal style={{width: "25vw"}} open={editOpen} onCloseClick={() => setEditOpen(false)}>
                <UserEdit 
                    oldUsername={protectedData.username}
                    oldPreview={protectedData.avatar}
                    onClose={handleEditClose}
                />
            </Modal>
        </div>
    )
};

export default UserPage;