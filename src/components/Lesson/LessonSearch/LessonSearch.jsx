import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonSearch.module.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {useLessonActions} from "../useLessonActions";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const LessonSearch = () => {
    const navigate = useNavigate();
    const [filterTitle, setFilterTitle] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {
        publicLessonList,
        fetchGetLessonListPublic,
    } = useLessonActions();

    useEffect(() => {
        fetchGetLessonListPublic(filterTitle, 1, 1, 100);
    }, [filterTitle]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleLessonClick = (item) => {
        navigate(`/lesson/${item.id}/${item.title}`);
        setIsSearchOpen(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && filterTitle.trim()) {
            navigate(`/lessons?filter=${encodeURIComponent(filterTitle)}`);
            setIsSearchOpen(false);
        }
    };

    const maxListHeight = Math.min(
        publicLessonList.length * 100,
        window.innerHeight - 200
    );

    const Row = useCallback(({ index, style }) => {
        const item = publicLessonList[index];
        return (
            <div style={style}>
                <LessonItem
                    key={item.id}
                    data={item}
                    onClick={() => handleLessonClick(item)}
                />
            </div>
        );
    }, [publicLessonList]);
    
    return (
        <div className={styles.container}>
            <div className={styles.searchButtonContainer}>
                <input 
                    type="text"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    placeholder="Поиск по названию"
                    onKeyUp={handleKeyPress}
                    className={`${styles.searchInput} ${isSearchOpen ? styles.searchInputOpen : ''}`}
                />
                <div 
                    onClick={toggleSearch}
                    className={styles.searchButton}
                >
                    {isSearchOpen ? '✕' : '🔍︎'}
                </div>
            </div>

            {isSearchOpen && (
                <>
                    <div className={styles.listContainer} style={{ height: maxListHeight }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    itemCount={publicLessonList.length}
                                    itemSize={100}
                                    width={width}
                                >
                                    {Row}
                                </List>
                            )}
                        </AutoSizer>
                    </div>

                    <div className={styles.overlay} onClick={toggleSearch} />
                </>
            )}
        </div>
    )
};

export default LessonSearch;