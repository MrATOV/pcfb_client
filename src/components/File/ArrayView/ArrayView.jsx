import React, { useState, useEffect } from 'react';
import styles from './ArrayView.module.css';
import axios from "/src/config/axiosLessonsConfig";

const ArrayView = ({ filename }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [data, setData] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchGetData = async () => {
        try {
            const response = await axios.get(`/array/${filename}`, {
                params: {
                    offset: (currentPage - 1) * limit,
                    limit: limit,
                },
            });
            setData(response.data.data);
            setTotalPages(response.data.total_pages);
            setTotalElements(response.data.total_elements);
        } catch (error) {
            console.error("Error loading array data: ", error);
        }
    };

    useEffect(() => {
        if (filename) {
            fetchGetData();
        }
    }, [filename, currentPage, limit]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLimitChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        if (newLimit >= 1 && newLimit <= totalElements) {
            setLimit(newLimit);
            setCurrentPage(1);
        }
    };

    return (
        <div className={styles.arrayViewer}>
            <div className={styles.limitSelector}>
                <label htmlFor="limit">Элементов на странице: </label>
                <input
                    type="number"
                    id="limit"
                    value={limit}
                    min={1}
                    max={totalElements}
                    onChange={handleLimitChange}
                />
            </div>

            <div className={styles.arrayContainer}>
                {data ? (
                    data.map((item, index) => (
                        <div key={index} className={styles.arrayItem}>
                            {item}
                        </div>
                    ))
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ArrayView;