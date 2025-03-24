import { useNavigate } from 'react-router-dom';
import styles from './Authorize.module.css';

const Authorize = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.auth}>
            <button onClick={() => {navigate('/login')}}>Войти</button>
            <button onClick={() => {navigate('/register')}}>Регистрация</button>
        </div>
    )
};

export default Authorize;