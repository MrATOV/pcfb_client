import React, { createContext, useState, useEffect } from 'react';
import axios from '/src/config/axiosUsersConfig';

export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [protectedData, setProtectedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const fetchProtectedData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('/users/protected', {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            const user = response.data;
            if (user.avatar) {
                user.avatar = `${axios.defaults.baseURL}/${user.avatar}`;
            };
            
            setProtectedData(prev => {
                if (JSON.stringify(prev) != JSON.stringify(user)) {
                    return user;
                }
                return prev;
            });
        } catch (error) {
            setProtectedData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProtectedData();
        
        const intervalId = setInterval(() => {
            fetchProtectedData();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const currentTheme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prevMode => !prevMode);
    };

    return (
        <Context.Provider value={{protectedData, loading, fetchProtectedData, isDark, toggleTheme}}>
            {children}
        </Context.Provider>
    )
}