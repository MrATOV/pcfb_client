import UserList from './UserList/UserList';
import GroupSelect from './GroupSelect/GroupSelect';
import styles from './UserField.module.css';
import { useUserActions } from './useUserActions';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {Context} from '/src/Context';
import Dialog from '../Dialog/Dialog';
import Paginator from '../Paginator/Paginator';

import gridIcon from '/src/assets/field_icons/grid.svg';
import tableIcon from '/src/assets/field_icons/table.svg';

const UserField = ({selectedItems, onSelectItems}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { 
        users, 
        fetchGetStudents, 
        usersCount,
        groups,
        fetchGetGroups,
        fetchGetGroupStudents,
        fetchAddGroup,
        fetchAddGroupUsers,
        fetchDeleteGroup,
        fetchDeleteGroupUser
    } = useUserActions();

    const [filterName, setFilterName] = useState(searchParams.get('filter') || "");
    const [filterEmail, setFilterEmail] = useState(searchParams.get('email') || "");
    const [filterGroup, setFilterGroup] = useState(searchParams.get('group') || "");
    const [addFilterGroup, setAddFilterGroup] = useState("");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 100);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showSelectionPanel, setShowSelectionPanel] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [addGroupOpen, setAddGroupOpen] = useState(false);
    const [addGroupSelect, setAddGroupSelect] = useState(null);
    const [addGroupName, setAddGroupName] = useState("");
    const { protectedData } = useContext(Context);

    const fetchData = useCallback(() => {
        if (selectedGroup) {
            fetchGetGroupStudents(selectedGroup.id, filterName, filterEmail, currentPage, pageSize);
        } else {
            fetchGetStudents(filterName, filterEmail, currentPage, pageSize);
        }
    }, [selectedGroup, filterName, filterEmail, currentPage, pageSize, fetchGetGroupStudents, fetchGetStudents]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterName) params.set('filter', filterName);
        if (filterEmail) params.set('email', filterEmail);
        if (filterGroup) params.set('group', filterGroup);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchGetGroups(filterGroup);
    }, [filterGroup, fetchGetGroups]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterName) params.set('filter', filterName);
        if (filterEmail) params.set('email', filterEmail);
        if (filterGroup) params.set('group', filterGroup);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        setCurrentPage(1);
    }, [filterName, filterEmail, selectedGroup, pageSize]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterName) params.set('filter', filterName);
        if (filterEmail) params.set('email', filterEmail);
        if (filterGroup) params.set('group', filterGroup);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (onSelectItems) {
            onSelectItems([]);
        } else {
            setSelectedUsers([]);
        }
        setShowSelectionPanel(false);
    }, [selectedGroup]);

    useEffect(() => {
        setShowSelectionPanel(selectedUsers.length > 0);
    }, [selectedUsers.length]);
    
    useEffect(() => {
        setShowSelectionPanel(selectedItems?.length > 0);
    }, [selectedItems?.length]);

    

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
    };

    const handleGetGroupUsers = (group) => {
        setSelectedGroup(group);
    };

    const handleUserSelect = (selectedIds) => {
        if (onSelectItems) {
            onSelectItems(selectedIds);
        } else {
            setSelectedUsers(selectedIds);
        }
    };

    const handleClearSelection = () => {
        if (onSelectItems) {
            onSelectItems([]);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleDeleteGroupUser = (user_id) => {
        fetchDeleteGroupUser(selectedGroup.id, user_id);
        if (onSelectItems) {
            onSelectItems(selectedItems.filter(item => item !== user_id));
        } else {
            setSelectedUsers(selectedUsers.filter(item => item !== user_id));
        }
    };

    const handleAddStudents = async () => {
        if (addGroupSelect) {
            if (selectedItems) {
                await fetchAddGroupUsers(addGroupSelect.id, selectedItems);
            } else {
                await fetchAddGroupUsers(addGroupSelect.id, selectedUsers);
            }
        } else if (addGroupName) {
            if (selectedItems) {
                await fetchAddGroup(addGroupName, selectedItems);
            } else {
                await fetchAddGroup(addGroupName, selectedUsers);
            }
        }
        setAddGroupOpen(false);
    };

    const handleSelectAll = () => {
        if (onSelectItems) {
            onSelectItems(users.map(item => item.id));
        } else {
            setSelectedUsers(users.map(item => item.id));
        }
    };

    const totalPages = Math.ceil(usersCount / pageSize) || 1;
    
    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <GroupSelect
                    groups={groups} 
                    filter={filterGroup}
                    onFilter={setFilterGroup}
                    onGroupSelect={handleGetGroupUsers}
                    onGroupDelete={(id) => fetchDeleteGroup(id, filterGroup)}
                    author_id={protectedData.id}
                />
                <input
                    className={styles.inputText} 
                    type="text" 
                    placeholder="Поиск по имени" 
                    value={filterName} 
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <input
                    className={styles.inputText}
                    type="email" 
                    placeholder="Поиск по эл. почте" 
                    value={filterEmail} 
                    onChange={(e) => setFilterEmail(e.target.value)}
                />
                <button className={styles.viewMode} title="Режим отображения" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
                    <img src={viewMode === 'table' ? gridIcon : tableIcon} alt="view"/>
                </button>
                <Paginator 
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalPages={totalPages}
                />
            </div>
            <div className={styles.panel}>
                <button onClick={handleSelectAll}>Выделить все</button>
                {showSelectionPanel && <>
                    <button
                        className={styles.clearSelection}
                        title="Сбросить выделение"
                        onClick={handleClearSelection}
                    >
                        ✕
                    </button>
                    <div style={{fontSize: "1.5rem", textDecoration: "underline"}}>
                        Выбрано обучающихся: {selectedItems ? selectedItems.length : selectedUsers.length}
                    </div>
                    <button onClick={() => setAddGroupOpen(true)}>Добавить в группу</button>
                    <Dialog
                        open={addGroupOpen} 
                        onNoClick={() => setAddGroupOpen(false)}
                        onYesClick={handleAddStudents}
                        title="Добаление обучающихся"
                        style={{width: "50vw", height: "43vh"}}
                    >
                        <p>Добавьте обучающихся в группу</p>
                        <GroupSelect
                            groups={groups}
                            filter={addFilterGroup}
                            onFilter={setAddFilterGroup}
                            onGroupSelect={(id) => setAddGroupSelect(id)}
                        />
                        <p>Или создайте новую группу</p>
                        <input
                            className={styles.inputText}
                            style={{width: "100%"}}
                            type="text"
                            placeholder="Введите название новой группы"
                            value={addGroupName}
                            onChange={(e) => setAddGroupName(e.target.value)}
                        />
                    </Dialog>
                </>}
            </div>
            
            <div className={styles.userList}>
                <UserList 
                    users={users} 
                    selectedItems={selectedItems ? selectedItems : selectedUsers} 
                    onSelectItems={onSelectItems ? onSelectItems : handleUserSelect} 
                    onDeleteItem={(selectedGroup && selectedGroup.user_id == protectedData.id) ? (user_id) => handleDeleteGroupUser(user_id) : null}
                    viewMode={viewMode}
                />
            </div>
        </div>
    )
};

export default UserField;