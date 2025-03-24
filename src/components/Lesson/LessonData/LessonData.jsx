import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useLessonActions } from '../useLessonActions';
import LessonEdit from './LessonEdit';
import LessonView from './LessonView';

const LessonData = ({role}) => {
    const { id } = useParams();
    const {
        lessonData,
        fetchGetLessonData,
        onChangeLessonDataItems,
        onUpdateLessonDataItem,
        fetchAddLessonDataItem,
        fetchDeleteLessonData,
    } = useLessonActions();

    useEffect(() => {
        if (id) {
            fetchGetLessonData(id);
        }
    }, [id]);

    return (role && (
        role === "student" ? 
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
        )
    )
};

export default LessonData;