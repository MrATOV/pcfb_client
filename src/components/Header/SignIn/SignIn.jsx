import { useState, useContext } from 'react';
import { Context } from '/src/Context';
import styles from './SignIn.module.css'
import axios from '/src/config/axiosLessonsConfig';
import logo from '/src/assets/logo.svg'
import Modal from '/src/components/Modal/Modal'
import { useNavigate } from 'react-router-dom';

export default function SignIn(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const { fetchProtectedData } = useContext(Context);
    const navigate = useNavigate();

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            var formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post('/users/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const {access_token} = response.data;
            localStorage.setItem('access_token', access_token);
            await fetchProtectedData();
            navigate('/')
        } catch (error) {
            setUnauthorized(true)
            console.log(error);
        }
    }

    return (
        <>
            <form className={styles.auth_form} onSubmit={handleSignIn}>
                <div className={styles.title}>
                    <img className={styles.logo} src={logo} alt='logo'/>
                    <span>Авторизация</span>
                </div>
                {unauthorized && <p className={styles.unauthorized}>Неправильный логин или пароль</p>}
                <input type="email" placeholder='Электронная почта' value={username} onChange={(event) => setUsername(event.target.value)}/>
                <input type="password" placeholder='Пароль' value={password} onChange={(event) => setPassword(event.target.value)}/>
                <button type="submit">Вход</button>
            </form>
            <button className={styles.register_button} onClick={() => navigate('/register')}>Регистрация</button>
        </>
    )
}