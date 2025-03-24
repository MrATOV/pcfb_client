import styles from './HeaderView.module.css';

const HeaderView = ({content}) => {
    return <h2 className={styles.header}>{content}</h2>;
};

export default HeaderView;