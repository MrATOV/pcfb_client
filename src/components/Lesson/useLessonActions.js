import { useState, useCallback } from "react";
import axios from "/src/config/axiosLessonsConfig";
import axiosUsers from "/src/config/axiosUsersConfig";


export const useLessonActions = () => {
    const [authLessonList, setAuthLessonList] = useState([]);
    const [publicLessonList, setPublicLessonList] = useState([]);
    const [subscriptLessonList, setSubscriptLessonList] = useState([]);
    const [authCount, setAuthCount] = useState(0);
    const [publicCount, setPublicCount] = useState(0);
    const [subscriptCount, setSubscriptCount] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [private_access, setPrivateAccess] = useState(false);
    const [description, setDescription] = useState("");
    const [lessonTeacherId, setLessonTeacherId] = useState(0);
    const [lessonData, setLessonData] = useState(null);
    const [lessonBoundary, setLessonBoundary] = useState({prev: null, next: null});
    const [lessonDataCount, setLessonDataCount] = useState(0);
    const [headers, setHeaders] = useState([]);
    const fileTypes = ["image", "audio", "video"];
    
    const fetchAddLesson = useCallback(async (title, private_access, description) => {
        try {
            const data = { 
                title, 
                private_access, 
                description 
            };
            const accessToken = localStorage.getItem("access_token");
            await axios.post('/lesson', data, {
                headers: { 
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            setDialogOpen(false);
            await fetchGetLessonListOwn();
        } catch (error) {
            console.error("Add lesson error:", error);
        }
    }, []);

    const fetchGetLessonListSubscript = useCallback(async (title, total_count = null, page = 1, page_size = 10) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/lessons/users', {
                params: {
                    title,
                    total_count,
                    page,
                    page_size
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            setSubscriptLessonList(response.data.data);
            setSubscriptCount(response.data.total_count);
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
            
            return `${window.location.origin}/subscribe/${response.data.token}`;
        } catch (error) {
            console.error("Get lesson token error:", error);
        }
    }, []);

    const fetchBroadcastNotifications = useCallback(async (token, lesson_id, user_indices) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axiosUsers.post('notification/broadcast', {
                token,
                user_indices,
                lesson_id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            return response.status === 200;
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

    const fetchGetLessonListOwn = useCallback(async (title, total_count = null, page = 1, page_size = 10) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/lesson/list/own', {
                params: {
                    title,
                    total_count,
                    page,
                    page_size
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setAuthLessonList(response.data.data);
            setAuthCount(response.data.total_count);
        } catch (error) {
            console.error("Get lesson list error:", error);
        }
    }, []);
    
    const fetchGetLessonListPublic = useCallback(async (title = "", total_count = null, page = 1, page_size = 10) => {
        try {
            
            const response = await axios.get('/lesson/list/public', {
                params: {
                    title,
                    total_count,
                    page,
                    page_size
                }
            });
            setPublicLessonList(response.data);
            setPublicLessonList(response.data.data);
            setPublicCount(response.data.total_count);
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

    const fetchGetLessonData = useCallback(async (index, total_count = null, page = 1, page_size = 10, is_editing = false) => {

        try {
            const response = await axios.get(`/lesson/${index}/data`, {
                params: {
                    total_count,
                    page,
                    page_size,
                    is_editing,
                }
            });
            const data = await Promise.all(response.data.data.map(async item => {
                if (fileTypes.includes(item.type) && !item.content.startsWith("http")) {
                    item.content = `${axios.defaults.baseURL}/${item.content}`;
                }
                return item;
            }));
            const boundary = response.data.boundary;
            if (boundary.prev && fileTypes.includes(boundary?.prev.type) && !boundary?.prev.content.startsWith("http")) {
                boundary.prev.content = `${axios.defaults.baseURL}/${boundary.prev.content}`;
            }
            if (boundary.next && fileTypes.includes(boundary.next.type) && !boundary.next.content.startsWith("http")) {
                boundary.next.content = `${axios.defaults.baseURL}/${boundary.next.content}`;
            }
            setLessonData(data);
            setLessonTeacherId(response.data.teacher_id);
            setLessonBoundary(boundary);
            setLessonDataCount(response.data.total_count);
            setHeaders(response.data.headers);
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
        } catch (error) {
            console.error("Delete lesson data error:", error);
        }
    }, []);

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
        } catch (error) {
            console.error("Add lesson data error", error);
        }
    }, []);

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
        } catch (error) {
            console.error("Put lesson data error", error);
        }
    }, []);

    return {
        authLessonList,
        publicLessonList,
        subscriptLessonList,
        authCount,
        publicCount,
        subscriptCount,
        dialogOpen,
        title,
        private_access,
        lessonData,
        lessonTeacherId,
        lessonBoundary,
        lessonDataCount,
        headers,
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
        fetchBroadcastNotifications,
    };
};