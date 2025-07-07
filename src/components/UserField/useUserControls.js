import {useState, useCallback} from 'react';
import axios from '/src/config/axiosUsersConfig';

export const useUserControls = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [usersCount, setUsersCount] = useState(0);

    const fetchGetUsers = useCallback(async (username, email, role, page = 1, pageSize = 100) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/users', {
                params: {
                    username,
                    email,
                    role: role === 'all' ? null : role,
                    page,
                    page_size: pageSize
                }, 
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            if (response.data.users) {
                const data = await Promise.all(response.data.users.map(async item => {
                    if (item.avatar) {
                        item.avatar = `${axios.defaults.baseURL}/${item.avatar}`;
                    }
                    return item;
                }));
                setUsers(data);
            } else {
                setUsers([]);
            }
            setUsersCount(response.data.total_count || 0);
        } catch (error) {
            console.error('Error loading users', error);
        }
    }, []);

    const fetchDeleteUser = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/users/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setUsers(users.filter(item => item.id !== index));
            setUsersCount(usersCount - 1);
        } catch (error) {
            console.error('Error deleting user', error);
        }
    }, [users, usersCount]);

    const fetchConfirmTeacher = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.put(`/users/${index}/confirm`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error('Error confirm teacher', error);
        }
    }, []);

    return {
        users,
        usersCount,
        fetchGetUsers,
        fetchDeleteUser,
        fetchConfirmTeacher,
    }
}