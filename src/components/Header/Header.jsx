import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '/src/Context';
import styles from './Header.module.css';
import logo from '/src/assets/logo.svg';
import settings from '/src/assets/settings.svg';
import Authorize from './Authorize/Authorize';
import Unauthorize from './Unauthorize/Unauthorize';
import LessonSearch from '../Lesson/LessonSearch/LessonSearch';


const Header = ({userdata}) => {
    const {toggleTheme} = useContext(Context);    
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <header className={styles.header}>
            <Link to='/' className={styles.header_logo}>
                <img src={logo} alt="Лого" />
                <h3>Параллельные вычисления для начинающих</h3>
            </Link>
            {userdata && userdata.role !== 'admin' && <div className={styles.navigation}>
                <button className={location.pathname === '/' ? styles.active : ""} onClick={() => navigate('/')}>Главная</button>
                {userdata.role === 'student' && <>
                    <button className={location.pathname === '/data' ? styles.active : ""} onClick={() => navigate('/data')}>Данные</button>
                    <button className={location.pathname === '/code' ? styles.active : ""} onClick={() => navigate('/code')}>Редактор</button>
                    <button className={location.pathname === '/results' ? styles.active : ""} onClick={() => navigate('/results')}>Тесты</button>
                </>}
                {userdata.role === 'teacher' && 
                    <button 
                        style={{width: "max-content", padding: "0 10px"}} 
                        className={location.pathname === '/students' ? styles.active : ""} 
                        onClick={() => navigate('/students')}
                    >
                        Обучающиеся    
                    </button>}
            </div>}
            {userdata && userdata.role === 'admin' && <div className={styles.navigation}>
                <button style={{width: "130px"}} className={location.pathname === '/' ? styles.active : ""} onClick={() => navigate('/')}>Пользователи</button>
                <button className={location.pathname === '/lessons' ? styles.active : ""} onClick={() => navigate('/lessons')}>Уроки</button>
            </div>}
            <LessonSearch />
            <button className={styles.settingsButton} title="Настройки" onClick={toggleTheme}><img src={settings} alt="Настройки"/></button>
            <div className={styles.right}>
                {userdata ? <Unauthorize username={userdata.username} avatar={userdata.avatar}/> : <Authorize/>}
            </div>
        </header>
    )
};

export default Header;