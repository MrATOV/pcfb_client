import { useParams, Navigate } from 'react-router-dom';

const RegisterLinkHandler = () => {
    const {token} = useParams();

    if (token) {
        sessionStorage.setItem('registerToken', token);
    }

    return <Navigate to="/register" replace/>
};

export default RegisterLinkHandler;