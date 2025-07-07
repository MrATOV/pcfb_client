import { useState, useCallback } from 'react';
import axios from '/src/config/axiosUsersConfig';

export const useCodeActions = () => {
    const [codeList, setCodeList] = useState([]);

    const fetchGetCodeList = useCallback(async (filter = "") => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get('/data/code', {
                params: {
                    filter: filter || null,
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setCodeList(response.data);
        } catch (error) {
            console.error('Error selecting code list', error);
        }
    }, []);

    const fetchSaveNewCode = useCallback(async (code, filename, filter = "") => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const data = {
                text: code,
                filename
            };
            const response = await axios.post('/data/code', data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            fetchGetCodeList(filter);
            return response.data.id;
        } catch (error) {
            console.error("Error save new code file", error);
        }
    }, [fetchGetCodeList]);

    const fetchChangeCode = useCallback(async (code, filename, filter = "") => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const data = {
                text: code,
                filename
            };
            await axios.put('/data/code', data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            //fetchGetCodeList(filter);
            return true;
        } catch (error) {
            console.error("Error save new code file", error);
        }
    }, [/*fetchGetCodeList*/]);

    const fetchDeleteCodeFile = useCallback(async (index, filter = "") => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.delete(`/data/code/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            fetchGetCodeList(filter);
            return true;
        } catch (error) {
            console.error("Error delete code file", error);
        }
    }, [fetchGetCodeList]);

    const fetchGetSourceCode = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get(`/data/code/${index}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error get source code", error);
        }
    }, []);

    return {
        codeList,
        fetchSaveNewCode,
        fetchChangeCode,
        fetchGetCodeList,
        fetchDeleteCodeFile,
        fetchGetSourceCode,
    }
};