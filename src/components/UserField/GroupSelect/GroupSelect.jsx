import { useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import styles from './GroupSelect.module.css';

const GroupSelect = ({ groups, filter, onFilter, onGroupSelect, onGroupDelete, author_id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const handleFilterChange = useCallback((e) => {
        onFilter(e.target.value);
    }, [onFilter]);

    const handleGroupSelect = useCallback((group) => {
        setSelectedGroup(group);
        onGroupSelect(group);
        setIsOpen(false);
    }, [onGroupSelect]);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const Row = useCallback(({ index, style }) => {
        if (index === 0) {
            return (
                <div 
                    className={styles.row} 
                    onClick={() => handleGroupSelect(null)} 
                    style={style}
                >
                    Все
                </div>
            );
        }
        const groupIndex = index - 1;
        return (
            <div 
                className={styles.row} 
                onClick={() => handleGroupSelect(groups[groupIndex])} 
                style={style}
            >
                {author_id === groups[groupIndex]?.user_id ? "★ " : ""}{groups[groupIndex]?.title}
                {author_id === groups[groupIndex]?.user_id && onGroupDelete && <button onClick={(e) => {e.stopPropagation(); onGroupDelete(groups[groupIndex]?.id)}}>✕</button>}
            </div>
        );
    }, [groups, handleGroupSelect]);

    return (
        <div className={styles.select}>
            <input
                className={styles.text}
                type="text"
                value={selectedGroup ? selectedGroup.title : ""}
                onChange={handleFilterChange}
                onClick={toggleDropdown}
                placeholder="Выберите группу"
                readOnly
            />
            {isOpen && (
                <div className={styles.dropdown}>
                    <input
                        className={styles.filter}
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Фильтр групп"
                        autoFocus
                    />
                    <List
                        height={200}
                        itemCount={groups.length + 1}
                        itemSize={35}
                        width="100%"
                    >
                        {Row}
                    </List>
                </div>
            )}
        </div>
    );
};

export default GroupSelect;