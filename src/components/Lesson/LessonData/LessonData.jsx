import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Context } from '/src/Context'; 
import { useLessonActions } from '../useLessonActions';
import LessonEdit from './LessonEdit';
import LessonView from './LessonView';
import Dialog from '../../Dialog/Dialog';
import UserList from '../../UserList/UserList';

const LessonData = () => {
    const { protectedData } = useContext(Context);
    const [role, setRole] = useState('student');
    const [link, setLink] = useState('');
    const [userIndices, setUserIndices] = useState([]);
    const [userListOpen, setUserListOpen] = useState(false);
    const { id } = useParams();
    const {
        lessonData,
        fetchGetLessonData,
        fetchGetLessonToken,
        onChangeLessonDataItems,
        onUpdateLessonDataItem,
        fetchAddLessonDataItem,
        fetchDeleteLessonData,
        fetchBroadcastNotifications,
    } = useLessonActions();

    useEffect(() => {
        if (id) {
            fetchGetLessonData(id);
        }
    }, [id]);

    useEffect(() => {
        if (protectedData) {
            setRole(protectedData["role"]);
        } else {
            setRole('student');
        }
    }, [protectedData]);

    const handleGenerateLink = async () => {
        const link = await fetchGetLessonToken(id);
        setLink(link);
    }

    const handleBroadcast = async () => {
        setUserListOpen(false);
        await fetchBroadcastNotifications(link, id, userIndices);
    }

    return (<>
        {protectedData && protectedData["role"] === 'teacher' && (
            <>
                <button onClick={handleGenerateLink}>Сгенерировать ссылку</button>
                <span>{link}</span>
                <button onClick={() => setRole(role === 'teacher' ? 'student': 'teacher')}>{role === 'teacher' ? 'Режим просмотра': 'Режим редактирования'}</button>
                {link && <button onClick={() => setUserListOpen(true)}>Отправить приглашения</button>}
                <Dialog 
                    style={{width: "70vw"}}
                    open={userListOpen}
                    title="Список студентов"
                    onNoClick={() => setUserListOpen(false)}
                    onYesClick={handleBroadcast}
                >
                    <UserList selectedItems={userIndices} onSelectItems={setUserIndices} />
                </Dialog>
            </>
        )}
        {role === "student" ?
            <LessonView data={lessonData}/> 
        :
            <LessonEdit 
                data={lessonData}
                onChangeItems={onChangeLessonDataItems}
                onUpdateItem={onUpdateLessonDataItem}
                onAddItem={fetchAddLessonDataItem}
                onDeleteItemClick={fetchDeleteLessonData}
                lessonId={id}
            />
        }
    </>
    )
};

export default LessonData;