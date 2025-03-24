import { useState, useContext } from 'react'
import styles from './SignUp.module.css'
import axios from '/src/config/axiosLessonsConfig';
import logo from '/src/assets/logo.svg'
import { Context } from '/src/Context.jsx'
import { useNavigate } from 'react-router-dom'
import RoleBox from './RoleBox/RoleBox';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState('student');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const {isDark} = useContext(Context);
    const navigate = useNavigate();

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

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (checkFillFields()) {
            setError(false)
            try {
                const data = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "role": role,
                };
                const response = await axios.post('/users/register', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                alert("Регистрация прошла успешно.");
                navigate('/login')
            } catch (error) {
                if (error.response){
                    if (error.response.status === 500){
                        setMessage('Пользователь с такой электронной почтой уже существует');
                        setError(true);
                    }
                }
                console.error(error)
            } 
        } else {
            setError(true)
        }
    }

    return (
        <form className={`${styles.reg_form} ${isDark ? styles.dark : styles.light}`} onSubmit={handleSignUp}>
            <div className={styles.title}>
                <img className={styles.logo} src={logo} alt='logo'/>
                <span>Регистрация</span>
            </div>
            {error && <p className={styles.error}>{message}</p>}
            <input placeholder="Имя пользователя" type="text" onChange={(event) => setUsername(event.target.value)}/>
            <input placeholder="Электронная почта" type="email" autoComplete='off' onChange={(event) => setEmail(event.target.value)}/>
            <input placeholder="Пароль" type="password" autoComplete='new-password' onChange={(event) => setPassword(event.target.value)}/>
            <input placeholder="Подтвердите пароль" type="password" autoComplete='new-password' onChange={(event) => setConfirm(event.target.value)}/>
            
            <RoleBox role={role} setRole={() => setRole(role === 'student' ? 'teacher' : 'student')} />
            
            <button type="submit">Зарегистрироваться</button>
        </form>
    )
}