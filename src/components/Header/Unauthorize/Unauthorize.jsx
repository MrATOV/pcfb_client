import styles from './Unauthorize.module.css';
import Dialog from '/src/components/Dialog/Dialog';
import { useContext, useState } from "react";
import { Context } from "/src/Context";

const Unauthorize = ({children}) => {
    const { fetchProtectedData } = useContext(Context);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleYesClick = () => {
        setDialogOpen(false);
        localStorage.removeItem('access_token');
        fetchProtectedData();
    };

    return (
        <div className={styles.unauth}>
            <h3>{children}</h3>
            <button onClick={() => setDialogOpen(true)}>Выход</button>
            <Dialog open={dialogOpen} onYesClick={handleYesClick} onNoClick={() => {setDialogOpen(false)}}>Вы уверены, что хотите выйти?</Dialog>
        </div>
    )
};

export default Unauthorize;