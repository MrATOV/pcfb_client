import { useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './SourceList.module.css';

import fileIcon from '/src/assets/files/code.svg';

const SourceList = ({data, currentId, filter, onFilter, onFileClick, onFileDelete}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const handleFilterChange = useCallback((e) => {
        onFilter(e.target.value);
    }, [onFilter])

    const Row = useCallback(({index, style}) => {
        return (
            <div
                className={`${styles.row} ${(currentId && currentId === data[index]?.id) ? styles.active : ""}`}
                onClick={() => onFileClick(data[index]?.id)}
                style={style}
            >
                <img src={fileIcon} alt=""/>
                <p style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{data[index]?.path}</p>
                {onFileDelete && <button onClick={(e) => {e.stopPropagation(); onFileDelete(data[index]?.id)}}>✕</button>}
            </div>
        )
    }, [data, onFileClick, onFileDelete])

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header} onClick={toggleCollapse}>
                <h2>{isCollapsed ? '❯' : "Файлы ❮"}</h2>
            </div>
            {!isCollapsed && (
                <>
                    <input
                        className={styles.filter}
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Фильтр файлов"
                    />
                    <div className={styles.content}>
                        <AutoSizer>
                            {({ height, width}) => (
                                <List
                                    height={height}
                                    itemCount={data.length}
                                    itemSize={35}
                                    width={width}
                                >
                                    {Row}
                                </List>
                            )}
                        </AutoSizer>
                    </div>
                </>
            )}
        </div>
    )
};

export default SourceList;