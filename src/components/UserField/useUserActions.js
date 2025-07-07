import {useState, useCallback} from 'react';
import axios from '/src/config/axiosUsersConfig';

export const useUserActions = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [usersCount, setUsersCount] = useState(0);

    const fetchGetStudents = useCallback(async (username, email, page = 1, pageSize = 100) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/users/students', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    username: username || undefined,
                    email: email || undefined,
                    page: page,
                    page_size: pageSize,
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
            console.error('Error loading students', error);
        }
    }, []);
    
    const fetchGetGroupStudents = useCallback(async (group_id, username, email, page = 1, pageSize = 100) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get(`/groups/${group_id}/users`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    username: username || undefined,
                    email: email || undefined,
                    page: page,
                    page_size: pageSize,
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
            console.error('Error loading group students', error);
        }
    }, []);

    const fetchGetGroups = useCallback(async (filter = '') => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/groups', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    filter: filter || undefined, 
                },
            });
            setGroups(response.data || []);
        } catch (error) {
            console.error('Error loading groups', error);
        }
    }, []);

    const fetchAddGroupUsers = useCallback(async (group_id, user_indices) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.post('/groups/users', {
                group_id,
                user_indices
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
        } catch (error) {
            console.error('Error adding group', error);
        }
    }, []);

    const fetchAddGroup = useCallback(async (title, user_indices) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.post('/groups/add', {
                title,
                user_indices
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            fetchGetGroups();
        } catch (error) {
            console.error('Error adding group', error);
        }
    }, [fetchGetGroups]);

    const fetchDeleteGroup = useCallback(async (index, filter = '') => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/groups/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            fetchGetGroups(filter);
        } catch (error) {
            console.error('Error deleting group', error);
        }
    }, [fetchGetGroups]);

    const fetchDeleteGroupUser = useCallback(async (group_id, user_id) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/groups/${group_id}/users/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setUsers(users.filter(item => item.id !== user_id));
            setUsersCount(usersCount - 1);
        } catch (error) {
            console.error('Error deleting group user', error);
        }
    }, [users, usersCount]);
    
    return {
        users,
        usersCount,
        groups,
        fetchGetStudents,
        fetchGetGroups,
        fetchGetGroupStudents,
        fetchAddGroupUsers,
        fetchAddGroup,
        fetchDeleteGroup,
        fetchDeleteGroupUser
    };
};