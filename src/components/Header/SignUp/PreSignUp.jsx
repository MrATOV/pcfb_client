import { useState, useContext } from 'react'
import styles from './SignUp.module.css'
import axios from '/src/config/axiosUsersConfig';
import logo from '/src/assets/logo.svg'
import { Context } from '/src/Context.jsx'
import { useNavigate } from 'react-router-dom'
import {toast} from '/src/toast';
import RoleBox from './RoleBox/RoleBox';
import userIcon from '/src/assets/user.svg';

export default function PreSignUp() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {isDark} = useContext(Context);

    const checkFillFields = () => {
        if (email == '') {
            setMessage('Электронная почта не указана');
            return false;
        }
        return true;
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (checkFillFields()) {
            setError(false);
            setIsLoading(true);
            
            try {
                const data = {
                    "email": email,
                    "role": role,
                };
                const accessToken = localStorage.getItem('access_token');
                await axios.post('/users/preregister', data, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                toast.info("Приглашение отправлено.");
                
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

    const handleChangeRole = (e) => {
        setRole(e.target.value);
    }

    return (
        <form className={`${styles.reg_form} ${isDark ? styles.dark : styles.light}`} onSubmit={handleSignUp}>
            <div className={styles.title}>
                <img className={styles.logo} src={logo} alt='logo'/>
                <span>Регистрация</span>
            </div>
            {error && <p className={styles.error}>{message}</p>}
            
            <input placeholder="Электронная почта" type="email" autoComplete='off' onChange={(event) => setEmail(event.target.value)}/>
            
            <select value={role} onChange={handleChangeRole}>
                <option value={'student'}>Обучающийся</option>
                <option value={'teacher'}>Преподаватель</option>
                <option value={'admin'}>Администратор</option>
            </select>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Отправить приглашение'}
            </button>
        </form>
    )
}