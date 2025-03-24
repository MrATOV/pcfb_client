import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://172.17.32.1:8001',
});

export default axiosInstance;