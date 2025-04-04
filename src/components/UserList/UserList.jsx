import { useState, useEffect } from 'react';
import UserItem from "./UserItem/UserItem";
import axios from '/src/config/axiosLessonsConfig';
import styles from './UserList.module.css';

const UserList = ({selectedItems, onSelectItems}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchGetStudents = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const response = await axios.get('/users/students', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error load students', error);
            }
        };
        fetchGetStudents();

    }, []);
    
    const handleSelectClick = (index) => {
        onSelectItems(prev => {
            if (prev.includes(index)) {
                return prev.filter(id => id !== index);
            } else {
                return [...prev, index]
            }
        });
    }    

    return (
        <div className={styles.field}>
            {users && users.map((user) => (
                <UserItem 
                    key={user.id}
                    data={user}
                    isSelect={ selectedItems ? selectedItems.includes(user.id) : false}
                    onSelectClick={() => handleSelectClick(user.id)}
                />
            ))}
        </div>
    )
};

export default UserList;