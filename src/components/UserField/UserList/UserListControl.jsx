import UserItemControl from "./UserItem/UserItemControl";
import styles from './UserList.module.css';

const UserListControl = ({users, selectedItems, onSelectItems, onDeleteItem, onConfirmItem, viewMode = 'grid'}) => {
    
    const handleSelectClick = (index) => {
        if (onSelectItems) {
            onSelectItems(prev => {
                if (prev.includes(index)) {
                    return prev.filter(id => id !== index);
                } else {
                    return [...prev, index]
                }
            });
        }
    }    
    
    return (
        <div className={viewMode === 'grid' ? styles.gridContainer : styles.tableContainer}>
            {users && users.map((user) => (
                <UserItemControl 
                    key={user.id}
                    data={user}
                    isSelect={selectedItems ? selectedItems.includes(user.id) : false}
                    onSelectClick={() => handleSelectClick(user.id)}
                    onDeleteClick={onDeleteItem ? () => onDeleteItem(user.id) : null}
                    onConfirmItem={() => onConfirmItem(user.id)}
                    viewMode={viewMode}
                />
            ))}
        </div>
    )
};

export default UserListControl;