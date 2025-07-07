import styles from './Paginator.module.css';

const Paginator = ({page, onPageChange, pageSize, onPageSizeChange, totalPages}) => {
    return (
        <div className={styles.paginationControls}>
            <button 
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                ❮
            </button>
            <span>{page}/{totalPages}</span>
            <button 
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
            >
                ❯
            </button>
            <select value={pageSize} onChange={onPageSizeChange}>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
        </div>
    )
};

export default Paginator;