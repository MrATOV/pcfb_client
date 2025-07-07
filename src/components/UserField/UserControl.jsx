import UserListControl from './UserList/UserListControl';
import GroupSelect from './GroupSelect/GroupSelect';
import styles from './UserField.module.css';
import { useUserActions } from './useUserActions';
import { useUserControls } from './useUserControls';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {Context} from '/src/Context';
import Dialog from '../Dialog/Dialog';
import Modal from '../Modal/Modal';
import PreSignUp from '../Header/SignUp/PreSignUp';
import Paginator from '../Paginator/Paginator';

import gridIcon from '/src/assets/field_icons/grid.svg';
import tableIcon from '/src/assets/field_icons/table.svg';

const UserControl = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { 
        fetchGetStudents, 
        groups,
        fetchGetGroups,
        fetchGetGroupStudents,
        fetchAddGroup,
        fetchAddGroupUsers,
        fetchDeleteGroup,
        fetchDeleteGroupUser
    } = useUserActions();

    const {
        users,
        usersCount,
        fetchGetUsers,
        fetchDeleteUser,
        fetchConfirmTeacher,
    } = useUserControls();

    const [filterName, setFilterName] = useState(searchParams.get('filter') || "");
    const [filterEmail, setFilterEmail] = useState(searchParams.get('email') ||  "");
    const [filterRole, setFilterRole] = useState(searchParams.get('role') || "all");
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
    const [newUserOpen, setNewUserOpen] = useState(false);
    const [deleteTypeOpen, setDeleteTypeOpen] = useState({id: 0, open: false});
    const { protectedData } = useContext(Context);

    const fetchData = useCallback(() => {
        if (selectedGroup) {
            fetchGetGroupStudents(selectedGroup.id, filterName, filterEmail, currentPage, pageSize);
        } else {
            fetchGetUsers(filterName, filterEmail, filterRole, currentPage, pageSize);
        }
    }, [selectedGroup, filterName, filterEmail, filterRole, currentPage, pageSize, fetchGetGroupStudents, fetchGetStudents]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterName) params.set('filter', filterName);
        if (filterEmail) params.set('email', filterEmail);
        if (filterRole !== 'all') params.set('role', filterRole);
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
        if (filterRole !== 'all') params.set('role', filterRole);
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
        if (filterRole !== 'all') params.set('role', filterRole);
        if (filterGroup) params.set('group', filterGroup);
        if (currentPage > 1) params.set('page', currentPage);
        if (pageSize !== 100) params.set('pageSize', pageSize);
        setSearchParams(params);
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setSelectedUsers([]);
        setShowSelectionPanel(false);
    }, [selectedGroup]);

    useEffect(() => {
        setShowSelectionPanel(selectedUsers.length > 0);
    }, [selectedUsers.length]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
    };

    const handleFilterRoleChange = (e) => {
        setFilterRole(e.target.value);
    }

    const handleGetGroupUsers = (group) => {
        setSelectedGroup(group);
    };

    const handleUserSelect = (selectedIds) => {
        setSelectedUsers(selectedIds);
    };

    const handleClearSelection = () => {
        setSelectedUsers([]);
    };

    const handleDeleteGroupUser = (user_id) => {
        fetchDeleteGroupUser(selectedGroup.id, user_id);
        setSelectedUsers(selectedUsers.filter(item => item !== user_id));
    };

    const handleDeleteUser = (user_id) => {
        fetchDeleteUser(user_id);
    }

    const handleAddStudents = async () => {
        if (addGroupSelect) {
            await fetchAddGroupUsers(addGroupSelect.id, selectedUsers);
        } else if (addGroupName) {
            await fetchAddGroup(addGroupName, selectedUsers);
        }
        setAddGroupOpen(false);
    };

    const handleSelectAll = () => {
        setSelectedUsers(users.map(item => item.id));
    };

    const handleConfirmTeacher = async (index) => {
        await fetchConfirmTeacher(index);
        await fetchGetUsers(filterName, filterEmail, filterRole, currentPage, pageSize);
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
                <select value={filterRole} onChange={handleFilterRoleChange}>
                    <option value="all">Все</option>
                    <option value="student">Обучающиеся</option>
                    <option value="teacher">Преподаватели</option>
                    <option value="not_confirmed">Подтверждение</option>
                </select>
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
                        Выбрано обучающихся: {selectedUsers.length}
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
                <button onClick={() => setNewUserOpen(true)}>Добавить пользователя</button>
            </div>
            
            <div className={styles.userList}>
                <UserListControl 
                    users={users} 
                    selectedItems={selectedUsers} 
                    onSelectItems={handleUserSelect} 
                    onConfirmItem={handleConfirmTeacher}
                    onDeleteItem={(selectedGroup && selectedGroup.user_id == protectedData.id) ? (user_id) => handleDeleteGroupUser(user_id) : (user_id) => setDeleteTypeOpen({id: user_id, open: true})}
                    viewMode={viewMode}
                />
            </div>
            <Modal style={{width: '25vw'}} open={newUserOpen} onCloseClick={() => {setNewUserOpen(false)}}>
                <PreSignUp/>
            </Modal>
            <Modal style={{width: "20vw"}} open={deleteTypeOpen.open} onCloseClick={() => setDeleteTypeOpen({id: 0, open: false})}>
                <h4>Хотите удалить пользователя или исключить из группы?</h4>
                <div style={{display: "flex"}}>
                    <button onClick={() => {handleDeleteUser(deleteTypeOpen.id); setDeleteTypeOpen({id: 0, open: false})}}>Удалить</button>
                    <button onClick={() => {handleDeleteGroupUser(deleteTypeOpen.id); setDeleteTypeOpen({id: 0, open: false})}}>Исключить</button>
                </div>
            </Modal>
        </div>
    )
};

export default UserControl;