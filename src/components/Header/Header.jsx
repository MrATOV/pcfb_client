import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '/src/Context';
import styles from './Header.module.css';
import logo from '/src/assets/logo.svg'
import Authorize from './Authorize/Authorize';
import Unauthorize from './Unauthorize/Unauthorize';



const Header = ({username}) => {
    const {toggleTheme} = useContext(Context);    
    return (
        <header className={styles.header}>
            <Link to='/' className={styles.header_logo}>
                <img src={logo} alt="Лого" />
                <h3>Потом назвать</h3>
            </Link>
            <button onClick={toggleTheme}>Еблысь</button>
            <div className={styles.right}>
                {username ? <Unauthorize>{username}</Unauthorize> : <Authorize/>}
            </div>
        </header>
    )
};

export default Header;