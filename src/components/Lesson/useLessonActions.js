import { useState, useCallback } from "react";
import axios from "/src/config/axiosLessonsConfig";


export const useLessonActions = () => {
    const [lessonList, setLessonList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [lessonData, setLessonData] = useState([]);
    const fileTypes = ["image", "audio", "video"];
    
    const fetchAddLesson = useCallback(async () => {
        try {
            const data = { title };
            await axios.post('/lesson', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setDialogOpen(false);
            await fetchGetLessonList();
        } catch (error) {
            console.error("Add lesson error:", error);
        }
    }, [title]);

    const fetchGetLessonList = useCallback(async () => {
        try {
            const response = await axios.get('/lesson/list');
            setLessonList(response.data);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    }, []);

    const fetchDeleteLesson = useCallback(async (index) => {
        try {
            await axios.delete(`/lesson/${index}`);
            await fetchGetLessonList();
        } catch (error) {
            console.error("Delete lesson error:", error);
        }
    }, [fetchGetLessonList]);

    const fetchGetLessonData = useCallback(async (index) => {
        try {
            const response = await axios.get(`/lesson/${index}/data`);
            const data = await Promise.all(response.data.map(async item => {
                if (fileTypes.includes(item.type) && !item.content.startsWith("http")) {
                    item.content = `${axios.defaults.baseURL}/${item.content}`;
                }
                return item;
            }));
            setLessonData(data);
        } catch (error) {
            console.error("Get lesson data error:", error);
        }
    }, []);

    const fetchDeleteLessonData = useCallback(async (index, lesson_id) => {
        try {
            await axios.delete(`/lesson/${lesson_id}/data/${index}`);
            await fetchGetLessonData(lesson_id);
        } catch (error) {
            console.error("Delete lesson data error:", error);
        }
    }, [fetchGetLessonData]);

    const fetchAddLessonDataItem = useCallback(async (item, lesson_id) => {
        const formData = new FormData();

        if (fileTypes.includes(item.type) && item.content instanceof File) {
            formData.append('file', item.content);
            item.content = "";
        }
        formData.append('lesson_data', JSON.stringify(item));

        try {
            await axios.post(`/lesson/${lesson_id}/data`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchGetLessonData(lesson_id);
        } catch (error) {
            console.error("Add lesson data error", error);
        }
    }, [fetchGetLessonData]);

    const fetchUpdatelessonDataItem = useCallback(async (item) => {
        const formData = new FormData();
        
        if (fileTypes.includes(item.type) && item.content instanceof File) {
            formData.append('file', item.content);
            item.content = "";
        }
        formData.append('lesson_data', JSON.stringify(item));
        try {
            const response = await axios.put(`/lesson/${item.lesson_id}/data/${item.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.filename) {
                item.content = `${axios.defaults.baseURL}/${response.data.filename}`;
            }
            await fetchGetLessonData(item.lesson_id);
        } catch (error) {
            console.error("Put lesson data error", error);
        }
    }, [fetchGetLessonData]);

    const onUpdateLessonDataItem = useCallback((order, newContent) => {
        lessonData.forEach(async item => {
            if (item.order === order) {
                const newItem = { ...item, content: newContent };
                await fetchUpdatelessonDataItem(newItem);
            }
        });
    }, [lessonData, fetchUpdatelessonDataItem]);

    const onChangeLessonDataItems = useCallback(async (firstOrder, secondOrder) => {
        const firstItem = lessonData.find(item => item.order === firstOrder);
        const secondItem = lessonData.find(item => item.order === secondOrder);
        const updatedFirstItem = { ...firstItem, order: secondOrder };
        const updatedSecondItem = { ...secondItem, order: firstOrder };
        await fetchUpdatelessonDataItem(updatedFirstItem);
        await fetchUpdatelessonDataItem(updatedSecondItem);
    }, [lessonData, fetchUpdatelessonDataItem]);

    return {
        lessonList,
        dialogOpen,
        title,
        lessonData,
        setDialogOpen,
        setTitle,
        fetchAddLesson,
        fetchGetLessonList,
        fetchDeleteLesson,
        fetchGetLessonData,
        fetchDeleteLessonData,
        fetchAddLessonDataItem,
        fetchUpdatelessonDataItem,
        onUpdateLessonDataItem,
        onChangeLessonDataItems,
    };
};