import styles from './Unauthorize.module.css';
import Dialog from '/src/components/Dialog/Dialog';
import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "/src/Context";
import userLogo from "/src/assets/user.svg";
import axios from '/src/config/axiosUsersConfig';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import MarkdownView from '../../Lesson/ContentBlock/MarkdownView/MarkdownView';

const Unauthorize = ({username, avatar}) => {
    const { fetchProtectedData } = useContext(Context);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notReadCount, setNotReadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const triggerRef = useRef(null);

    const fetchGetNotifications = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/notifications', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setNotifications(response.data);
            setNotReadCount(response.data.filter(obj => obj.is_read === false).length);
        }
        catch (error) {
            console.error("Error load notifications", error);
        }
    }

    const fetchReadNotification = async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.put(`/notifications/${index}`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            await fetchGetNotifications();
        } catch (error) {
            console.error('Error read notification', errro);
        }
    }
    
    const fetchDeleteNotification = async (index) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(`/notifications/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            await fetchGetNotifications();
        } catch (error) {
            console.error('Error read notification', errro);
        }
    }

    useEffect(() => {
        fetchGetNotifications();

        const intervalId = setInterval(() => {
            fetchGetNotifications();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleYesClick = () => {
        setDialogOpen(false);
        localStorage.removeItem('access_token');
        fetchProtectedData();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <div className={styles.unauth}>
            <div className={styles.userLogo} ref={triggerRef} onClick={toggleDropdown}>
                <img src={avatar ? avatar : userLogo} alt="user"/>
                {notReadCount > 0 && <div className={styles.notification}>{notReadCount}</div>}
            </div>
            <h3>{username}</h3>
            <button onClick={() => setDialogOpen(true)}>Выход</button>
            <Dialog open={dialogOpen} onYesClick={handleYesClick} onNoClick={() => {setDialogOpen(false)}}>
                <p>Вы уверены, что хотите выйти?</p>
            </Dialog>
            <DropdownMenu
                style={{top: "100%", right: "100%"}}
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                triggerRef={triggerRef}
            >
                <h3>Уведомления</h3>
                {notifications.length > 0 && notifications.map(item => (
                    <div 
                        className={`${styles.notificationItem} ${item.is_read ? "" : styles.notRead}`} 
                        key={item.id}
                        onClick={() => fetchReadNotification(item.id)}
                    >
                        <MarkdownView className={styles.notificationText} content={item.text}/>
                        <button className={styles.deleteButton} onClick={(e) => {e.stopPropagation(); fetchDeleteNotification(item.id);}}>✕</button>
                    </div>
                ))}
            </DropdownMenu>
        </div>
    )
};

export default Unauthorize;