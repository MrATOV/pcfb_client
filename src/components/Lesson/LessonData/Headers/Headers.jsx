import styles from './Headers.module.css';

const Headers = ({data, onHeaderClick, currentPage}) => {
    return (
        <div className={styles.container}>
            <h2>Заголовки</h2>
            {data && data.map(header => (
                <div 
                    key={header.id} 
                    className={`${styles.item} ${currentPage === header.page ? styles.currentPage : ""}`} 
                    onClick={() => onHeaderClick(header.page, header.order)}
                >
                    <span>{header.content}</span>
                    <span>{header.page}</span>
                </div>
            ))}
        </div>
    );
};

export default Headers;