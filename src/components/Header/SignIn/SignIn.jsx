import { useState, useContext } from 'react';
import { Context } from '/src/Context';
import styles from './SignIn.module.css'
import axios from '/src/config/axiosUsersConfig';
import logo from '/src/assets/logo.svg'
import Modal from '/src/components/Modal/Modal'
import { useNavigate } from 'react-router-dom';

export default function SignIn(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
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
            if (error.status === 403) {
                setErrorMessage("Аккаунт еще не подтвержден")
                console.log(error);
            } else {
                setErrorMessage("Неправильный логин или пароль")
                console.error(error);
            }
        }
    }

    return (
        <>
            <form className={styles.auth_form} onSubmit={handleSignIn}>
                <div className={styles.title}>
                    <img className={styles.logo} src={logo} alt='logo'/>
                    <span>Авторизация</span>
                </div>
                {errorMessage && <p className={styles.unauthorized}>{errorMessage}</p>}
                <input type="email" placeholder='Электронная почта' value={username} onChange={(event) => setUsername(event.target.value)}/>
                <input type="password" placeholder='Пароль' value={password} onChange={(event) => setPassword(event.target.value)}/>
                <button type="submit">Вход</button>
            </form>
            <button className={styles.register_button} onClick={() => navigate('/register')}>Регистрация</button>
        </>
    )
}