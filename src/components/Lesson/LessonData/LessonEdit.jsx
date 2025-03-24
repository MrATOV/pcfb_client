import { useState, useEffect, useContext } from 'react';
import { Context } from '/src/Context';
import ContentBlock from '../ContentBlock/ContentBlock';
import ContentEditor from '../ContentEditor/ContentEditor';
import ContentTools from "../ContentTools/ContentTools";
import styles from './LessonData.module.css';

import upIcon from '/src/assets/icons/up.svg';
import downIcon from '/src/assets/icons/down.svg';
import cancelIcon from '/src/assets/icons/cancel.svg';
import editIcon from '/src/assets/icons/edit.svg';
import saveIcon from '/src/assets/icons/save.svg';
import deleteIcon from '/src/assets/icons/delete.svg';

import upIconDark from '/src/assets/icons/dark/up.svg';
import downIconDark from '/src/assets/icons/dark/down.svg';
import cancelIconDark from '/src/assets/icons/dark/cancel.svg';
import editIconDark from '/src/assets/icons/dark/edit.svg';
import saveIconDark from '/src/assets/icons/dark/save.svg';
import deleteIconDark from '/src/assets/icons/dark/delete.svg';

const LessonEdit = ({data, onUpdateItem, onChangeItems, onAddItem, onDeleteItemClick, lessonId }) => {
    const [editingOrders, setEditingOrders] = useState({});
    const [localContents, setLocalContents] = useState({});
    const [newItem, setNewItem] = useState(null);
    const [firstOrder, setFirstOrder] = useState(0);
    const [lastOrder, setLastOrder] = useState(0);
    const { isDark } = useContext(Context);

    useEffect(() => {
        const newContents = {};
        data.forEach(item => {
            if (editingOrders[item.order] && !(item.order in localContents)) {
                newContents[item.order] = item.content;
            }
        });
        if (Object.keys(newContents).length > 0) {
            setLocalContents(prev => ({ ...prev, ...newContents }));
        }
        if (data.length > 0) {
            setFirstOrder(Math.min(...data.map(item => item.order)));
            setLastOrder(Math.max(...data.map(item => item.order)));
        }
    }, [editingOrders, data]);

    const handleSave = (order) => {
        if (localContents[order] !== undefined) {
            onUpdateItem(order, localContents[order]);
            setEditingOrders(prev => ({ ...prev, [order]: false }));
        }
    };

    const handleCancel = (order) => {
        setEditingOrders(prev => ({ ...prev, [order]: false}));
        setLocalContents(prev => {
            const newContents = { ...prev };
            delete newContents[order];
            return newContents;
        });
    };

    const handleDelete = (index, lessonId, order) => {
        setEditingOrders(prev => {
            const newEditing = { ...prev };
            delete newEditing[order];
            return newEditing;
        });
        onDeleteItemClick(index, lessonId);
    };

    const handleMove = async (currentOrder, direction) => {
        if (currentOrder < firstOrder || currentOrder > lastOrder) return;

        const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

        await onChangeItems(newOrder, currentOrder);
    }

    const handleAddNewItem = (newItem) => {
        const newOrder = data.length > 0 ? Math.max(...data.map(item => item.order)) + 1 : 0;
        newItem.order = newOrder;
        setNewItem(newItem);
        setEditingOrders(prev => ({ ...prev, [newOrder]: true }));
    };

    const handleSaveNewItem = () => {
        if (newItem) {
            onAddItem(newItem, lessonId);
            setNewItem(null);
            setEditingOrders(prev => ({ ...prev, [newItem.order]: false }));
        }
    };

    const handleCancelNewItem = () => {
        setNewItem(null);
    }

    return (
        <div className={styles.container}>
            <ContentTools onAddNewItem={handleAddNewItem} />
            {data && data.map((item) => (
                <div className={styles.item} key={item.id}>
                    <div className={styles.itemUtils}>
                        {editingOrders[item.order] ? (
                            <>
                                <button title="Сохранить" onClick={() => handleSave(item.order)}>
                                    <img src={isDark ? saveIconDark : saveIcon} alt=""/>
                                </button>
                                <button title="Отменить" onClick={() => handleCancel(item.order) }>
                                    <img src={isDark ? cancelIconDark : cancelIcon} alt="" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button title="Редактировать" onClick={() => setEditingOrders(prev => ({ ...prev, [item.order]: true}))}>
                                    <img src={isDark ? editIconDark : editIcon} alt="" />
                                </button>
                            </>
                        )}
                        <button title="Удалить" onClick={() => handleDelete(item.id, item.lesson_id, item.order)}>
                            <img src={isDark ? deleteIconDark : deleteIcon } alt=""/>
                        </button>
                        
                        <button style={{marginLeft: "auto"}} title="Переместить вверх" onClick={async () => await handleMove(item.order, 'up')} disabled={item.order === firstOrder || editingOrders[item.order]}>
                            <img src={isDark ? upIconDark : upIcon} alt="" />
                        </button>
                        <button title="Переместить вниз" onClick={async () => await handleMove(item.order, 'down')} disabled={item.order === lastOrder || editingOrders[item.order]}>
                            <img src={isDark ? downIconDark : downIcon} alt="" />
                        </button>
                    </div>
                    
                    {editingOrders[item.order] ? (
                        <ContentEditor 
                            type={item.type}
                            content={localContents[item.order] || ''}
                            onUpdate={(content) => setLocalContents(prev => ({
                                ...prev,
                                [item.order]: content
                            }))}
                        />
                    ) : (
                        <ContentBlock type={item.type} content={item.content}/>
                    )}
                </div>
            ))}
            {newItem && (
                <div className={styles.item}>
                    <div className={styles.itemUtils}>
                        <button onClick={handleSaveNewItem}>
                            <img src={isDark ? saveIconDark : saveIcon} alt="" />
                        </button>
                        <button onClick={handleCancelNewItem}>
                            <img src={isDark ? cancelIconDark : cancelIcon} alt="" />
                        </button>
                    </div>
                    <ContentEditor
                        type={newItem.type}
                        content={newItem.content}
                        onUpdate={(content) => setNewItem(prev => ({
                            ...prev,
                            content
                        }))}
                    />
                </div>
            )}
        </div>
    )
};

export default LessonEdit;