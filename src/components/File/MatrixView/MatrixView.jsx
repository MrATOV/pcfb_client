import React, { useState, useEffect } from 'react';
import styles from './MatrixView.module.css';
import axios from "/src/config/axiosLessonsConfig";

const MatrixView = ({ filename }) => {
    const [currentPageRow, setCurrentPageRow] = useState(1);
    const [currentPageCol, setCurrentPageCol] = useState(1);
    const [limitRow, setLimitRow] = useState(10);
    const [limitCol, setLimitCol] = useState(10);
    const [data, setData] = useState(null);
    const [totalPagesRow, setTotalPagesRow] = useState(1);
    const [totalPagesCol, setTotalPagesCol] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalCols, setTotalCols] = useState(0);

    const fetchGetData = async () => {
        try {
            const response = await axios.get(`/matrix/${filename}`, {
                params: {
                    page_row: currentPageRow,
                    page_col: currentPageCol,
                    limit_row: limitRow,
                    limit_col: limitCol,
                },
            });
            setData(response.data.data);
            setTotalPagesRow(response.data.total_pages_row);
            setTotalPagesCol(response.data.total_pages_col);
            setTotalRows(response.data.total_rows);
            setTotalCols(response.data.total_cols);
        } catch (error) {
            console.error("Error loading matrix data: ", error);
        }
    };

    useEffect(() => {
        if (filename) {
            fetchGetData();
        }
    }, [filename, currentPageRow, currentPageCol, limitRow, limitCol]);

    const handlePrevPageRow = () => {
        if (currentPageRow > 1) {
            setCurrentPageRow(currentPageRow - 1);
        }
    };

    const handleNextPageRow = () => {
        if (currentPageRow < totalPagesRow) {
            setCurrentPageRow(currentPageRow + 1);
        }
    };

    const handlePrevPageCol = () => {
        if (currentPageCol > 1) {
            setCurrentPageCol(currentPageCol - 1);
        }
    };

    const handleNextPageCol = () => {
        if (currentPageCol < totalPagesCol) {
            setCurrentPageCol(currentPageCol + 1);
        }
    };

    const handleLimitRowChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        if (newLimit >= 1 && newLimit <= totalRows) {
            setLimitRow(newLimit);
            setCurrentPageRow(1);
        }
    };

    const handleLimitColChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        if (newLimit >= 1 && newLimit <= totalCols) {
            setLimitCol(newLimit);
            setCurrentPageCol(1);
        }
    };

    return (
        <div className={styles.matrixViewer}>
            <div className={styles.limitSelector}>
                <label htmlFor="limitRow">Строк на странице: </label>
                <input
                    type="number"
                    id="limitRow"
                    value={limitRow}
                    min={1}
                    max={totalRows}
                    onChange={handleLimitRowChange}
                />
                <label htmlFor="limitCol">Столбцов на странице: </label>
                <input
                    type="number"
                    id="limitCol"
                    value={limitCol}
                    min={1}
                    max={totalCols}
                    onChange={handleLimitColChange}
                />
            </div>

            <div className={styles.matrixContainer}>
                {data ? (
                    data.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.matrixRow}>
                            {row.map((item, colIndex) => (
                                <div key={colIndex} className={styles.matrixItem}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            <div className={styles.paginationRow}>
                <button onClick={handlePrevPageRow} disabled={currentPageRow === 1}>
                    Previous Row
                </button>
                <span>
                    Row Page {currentPageRow} of {totalPagesRow}
                </span>
                <button onClick={handleNextPageRow} disabled={currentPageRow === totalPagesRow}>
                    Next Row
                </button>
            </div>

            <div className={styles.paginationCol}>
                <button onClick={handlePrevPageCol} disabled={currentPageCol === 1}>
                    Previous Col
                </button>
                <span>
                    Col Page {currentPageCol} of {totalPagesCol}
                </span>
                <button onClick={handleNextPageCol} disabled={currentPageCol === totalPagesCol}>
                    Next Col
                </button>
            </div>
        </div>
    );
};

export default MatrixView;