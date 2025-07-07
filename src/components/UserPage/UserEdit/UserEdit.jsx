import { useState, useContext, useEffect } from 'react'
import styles from './UserEdit.module.css'
import axios from '/src/config/axiosUsersConfig';
import { Context } from '/src/Context.jsx'
import {toast} from '/src/toast';
import userIcon from '/src/assets/user.svg';

export default function UserEdit({oldUsername, oldPreview, onClose}) {
    const [username, setUsername] = useState(oldUsername);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(oldPreview);
    const [isLoading, setIsLoading] = useState(false);
    const {isDark} = useContext(Context);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (password && password !== confirm) {
            setError(true);
            setMessage("Необходимо подтвердить пароль.");
            return;
        }
        setError(false);
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            const userData = {
                "username": username,
                "password": password,
            };
            
            formData.append('data', JSON.stringify(userData));
            if (avatar) {
                formData.append('file', avatar);
            }
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.put('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            toast.info("Изменения сохранены.");
            const {access_token} = response.data;
            localStorage.setItem('access_token', access_token);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className={`${styles.reg_form} ${isDark ? styles.dark : styles.light}`} onSubmit={handleSignUp}>
            <div className={styles.title}>
                <span>Редактирование</span>
            </div>
            {error && <p className={styles.error}>{message}</p>}
            
            <div className={styles.avatar_upload}>
                <label htmlFor="avatar-upload" className={styles.avatar_label}>
                    {preview ? (
                        <img src={preview} alt="Avatar preview" className={styles.avatar_preview} />
                    ) : (
                        <div className={styles.avatar_placeholder}>
                            <img style={{height: "80%"}} src={userIcon} alt='icon'/>
                        </div>
                    )}
                </label>
                <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.avatar_input}
                />
                {preview && (
                    <button 
                        type="button" 
                        className={styles.remove_avatar}
                        onClick={() => {
                            setAvatar(null);
                            setPreview(null);
                        }}
                    >
                        Удалить аватар
                    </button>
                )}
            </div>
            
            <input placeholder="Имя пользователя" type="text" onChange={(event) => setUsername(event.target.value)}/>
            <input placeholder="Пароль" type="password" autoComplete='new-password' onChange={(event) => setPassword(event.target.value)}/>
            <input placeholder="Подтвердите пароль" type="password" autoComplete='new-password' onChange={(event) => setConfirm(event.target.value)}/>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Изменить'}
            </button>
        </form>
    )
}