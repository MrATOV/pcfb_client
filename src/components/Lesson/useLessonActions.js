import { useState, useCallback } from "react";
import axios from "/src/config/axiosLessonsConfig";


export const useLessonActions = () => {
    const [authLessonList, setAuthLessonList] = useState([]);
    const [publicLessonList, setPublicLessonList] = useState([]);
    const [subscriptLessonList, setSubscriptLessonList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [private_access, setPrivateAccess] = useState(false);
    const [description, setDescription] = useState("");
    const [lessonData, setLessonData] = useState([]);
    const fileTypes = ["image", "audio", "video"];
    
    const fetchAddLesson = useCallback(async () => {
        try {
            const data = { 
                title, 
                private_access, 
                description 
            };
            const accessToken = localStorage.getItem("access_token");
            await axios.post('/lesson', data, {
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            setDialogOpen(false);
            await fetchGetLessonListOwn();
        } catch (error) {
            console.error("Add lesson error:", error);
        }
    }, [title]);

    const fetchGetLessonListSubscript = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/users/lessons', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            setSubscriptLessonList(response.data);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    }, []);
    
    const fetchGetLessonToken = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get(`/lesson/${index}/token`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            return `${window.location.origin}/subscribe/${response.data.token}`;
        } catch (error) {
            console.error("Get lesson token error:", error);
        }
    }, []);

    const fetchBroadcastNotifications = useCallback(async (token, lesson_id, user_indices) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.post('notification/broadcast', {
                token,
                user_indices,
                lesson_id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            if (response.status === 200) {
                alert("Приглашения отправлены");
            }
        } catch (error) {
            console.error("Error brotcast notifications: ", error);
        }
    }, []);

    const fetchSubscribe = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post(`lesson/${index}/subscribe`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            fetchGetLessonListSubscript();
        } catch (error) {
            console.error("Add lesson user error:", error);
        }
    }, [fetchGetLessonListSubscript]);
    
    const fetchSubscribeToken = useCallback(async (token) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post(`lesson/private/subscribe/${token}`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            fetchGetLessonListSubscript();
        } catch (error) {
            console.error("Add lesson user error:", error);
        }
    }, [fetchGetLessonListSubscript]);
    
    const fetchUnsubscribe = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.delete(`lesson/${index}/unsubscribe`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            fetchGetLessonListSubscript();
        } catch (error) {
            console.error("Add lesson user error:", error);
        }
    }, [fetchGetLessonListSubscript]);

    const fetchGetLessonListOwn = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/lesson/list/own', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setAuthLessonList(response.data);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    }, []);
    
    const fetchGetLessonListPublic = useCallback(async () => {
        try {
            const response = await axios.get('/lesson/list/public');
            setPublicLessonList(response.data);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    }, []);

    const fetchDeleteLesson = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.delete(`/lesson/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            await fetchGetLessonListOwn();
        } catch (error) {
            console.error("Delete lesson error:", error);
        }
    }, [fetchGetLessonListOwn]);

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
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/lesson/${lesson_id}/data/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
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
            const accessToken = localStorage.getItem('access_token');
            await axios.post(`/lesson/${lesson_id}/data`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
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
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.put(`/lesson/${item.lesson_id}/data/${item.id}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
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
        authLessonList,
        publicLessonList,
        subscriptLessonList,
        dialogOpen,
        title,
        private_access,
        lessonData,
        description,
        setDialogOpen,
        setPrivateAccess,
        setTitle,
        setDescription,
        fetchGetLessonToken,
        fetchSubscribe,
        fetchSubscribeToken,
        fetchUnsubscribe,
        fetchAddLesson,
        fetchGetLessonListOwn,
        fetchGetLessonListPublic,
        fetchGetLessonListSubscript,
        fetchDeleteLesson,
        fetchGetLessonData,
        fetchDeleteLessonData,
        fetchAddLessonDataItem,
        fetchUpdatelessonDataItem,
        onUpdateLessonDataItem,
        onChangeLessonDataItems,
        fetchBroadcastNotifications,
    };
};