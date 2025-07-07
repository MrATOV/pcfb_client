import { useState, useContext, useEffect } from 'react'
import styles from './SignUp.module.css'
import axios from '/src/config/axiosUsersConfig';
import logo from '/src/assets/logo.svg'
import { Context } from '/src/Context.jsx'
import { useNavigate } from 'react-router-dom'
import {toast} from '/src/toast';
import RoleBox from './RoleBox/RoleBox';
import userIcon from '/src/assets/user.svg';

const roleTitles = {
    'student': "Обучающийся",
    'teacher': "Преподаватель",
    'admin': "Администратор",
}

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState('student');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const {isDark} = useContext(Context);
    const navigate = useNavigate();

    const token = sessionStorage.getItem('registerToken');

    useEffect(() => {
        const fetchGetFirstData = async (token) => {
            try {
                const response = await axios.get('/users/preregister', {
                    params: {
                        token,
                    },
                });
                setEmail(response.data.email);
                setRole(response.data.role);
            } catch (error) {
                console.error("Error getting first data", error);
            }
        };

        if (token) {
            sessionStorage.removeItem('registerToken');
            setIsConfirmed(true);
            fetchGetFirstData(token);
        }
    }, [token]);

    const checkFillFields = () => {
        if (username == '') {
            setMessage('Имя пользователя не заполненно');
            return false;
        }
        if (email == '') {
            setMessage('Электронная почта не указана');
            return false;
        }
        if (password == '') {
            setMessage('Пароль не указан');
            return false;
        }
        if (confirm == '' || confirm != password) {
            setMessage('Необходимо подтвердить пароль');
            return false;
        }
        return true;
    }

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
        if (checkFillFields()) {
            setError(false);
            setIsLoading(true);
            
            try {
                const formData = new FormData();
                const userData = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "role": role,
                };
                
                formData.append('data', JSON.stringify(userData));
                if (avatar) {
                    formData.append('file', avatar);
                }
                let URL = '/users/register';
                if (isConfirmed) {
                    URL = `${URL}/confirmed`;
                }
                await axios.post(URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                if (role === 'teacher' && !isConfirmed) {
                    toast.info("Ожидайте подтверждения регистрации на электронной почте.");
                } else {
                    toast.info("Регистрация прошла успешно.");
                }
                navigate('/login');
            } catch (error) {
                if (error.response){
                    if (error.response.status === 500){
                        setMessage('Пользователь с такой электронной почтой уже существует');
                        setError(true);
                    }
                }
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setError(true);
        }
    }

    return (
        <form className={`${styles.reg_form} ${isDark ? styles.dark : styles.light}`} onSubmit={handleSignUp}>
            <div className={styles.title}>
                <img className={styles.logo} src={logo} alt='logo'/>
                <span>Регистрация</span>
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
            
            {isConfirmed ?
                <p>{email}</p> 
            :
                <input placeholder="Электронная почта" type="email" autoComplete='off' onChange={(event) => setEmail(event.target.value)}/>
            }
            <input placeholder="Имя пользователя" type="text" onChange={(event) => setUsername(event.target.value)}/>
            <input placeholder="Пароль" type="password" autoComplete='new-password' onChange={(event) => setPassword(event.target.value)}/>
            <input placeholder="Подтвердите пароль" type="password" autoComplete='new-password' onChange={(event) => setConfirm(event.target.value)}/>
            
            {isConfirmed ?
                <p>{roleTitles[role]}</p>
            :
                <RoleBox role={role} setRole={() => setRole(role === 'student' ? 'teacher' : 'student')} />
            }
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
        </form>
    )
}