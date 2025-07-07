import { useState, useCallback } from 'react';
import axios from "/src/config/axiosUsersConfig";

export const useDataActions = () => {
    const [dataList, setDataList] = useState([]);
    const [dataContent, setDataContent] = useState(null);
    const [dataCount, setDataCount] = useState(0);

    const fetchLoadData = useCallback(async (type = 'all', filter = '', total_count = null, page = 1, page_size = 10) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            let url;
            if (!type || type === 'all') {
                url = '/data/list';
            } else {
                url = `/data/list/${type}`
            }
            const response = await axios.get(url, {
                params: {
                    filter: filter,
                    total_count: total_count,
                    page: page,
                    page_size: page_size
                },
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            setDataList(response.data.data);
            setDataCount(response.data.total_count);
        } catch {
            console.error("Get default data error:", error);
        }
    }, []);
    
    const fetchGetDataContent = useCallback(async (type, filename, path = 'default') => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (['array', 'matrix'].includes(type)) {
                setDataContent(filename);
            } else if (type === 'text') {
                const response = await axios.get(`/data/${type}/${filename}`, {
                    params: {
                        'path': path
                    },
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                setDataContent(response.data);
            } else {
                const response = await axios.get(`/data/${type}/${filename}`, {
                    params: {
                        'path': path
                    },
                    responseType: "blob",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                const blob = new Blob([response.data], {
                    type: response.headers["content-type"],
                });
                const url = URL.createObjectURL(blob);
                setDataContent(url);
            }
        } catch (error) {
            console.error("Get default data error:", error);
        }
    }, []);
    
    const fetchDeleteData = useCallback(async (index) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.delete(`/data/${index}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            
            setDataList(dataList.filter(item => item.id !== index));
        } catch (error) {
            console.error("Delete data error:", error);
        }
    }, [dataList]);

    const fetchUploadFile = useCallback(async (data, type = 'all', filter = '', page = 1, page_size = 10) => {
        const formData = new FormData();
        formData.append('file', data.file);
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post(`/data/${data.type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            await fetchLoadData(type, filter, null, page, page_size);
        } catch (error) {
            console.error("Add default data error", error);
        }
    }, [fetchLoadData]);
    
    const fetchGenerateData = useCallback(async (generateData, type = 'all', filter = '', page = 1, page_size = 10) => {
        const data = {
            filename: generateData.filename,
            dataType: generateData.params.dataType
        };
        let requestType;
        if (generateData.params.generationType === 'random') {
            data.max = generateData.params.maxValue;
            data.min = generateData.params.minValue;
            requestType = 'random';
        } else {
            data.fillType = generateData.params.generationType === 'ascending' ? 0 : 1;
            data.start = generateData.params.startValue;
            data.step = generateData.params.step;
            data.interval = generateData.params.incrementInterval;
            requestType = 'order';
        }
        if (generateData.type === 'array') {
            data.size = generateData.params.dimensions[0];
        } else {
            data.rows = generateData.params.dimensions[0];
            data.cols = generateData.params.dimensions[1];
        }
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post(`/data/${generateData.type}/${requestType}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            await fetchLoadData(type, filter, null, page, page_size);
        } catch (error) {
            console.error("Generate default data error", error);
        }
    }, [fetchLoadData]);

    const fetchUploadText = useCallback(async (generateData, type = 'all', filter = '', page = 1, page_size = 10) => {
        
        const data = {
            filename: generateData.filename,
            text: generateData.textContent
        };
        try {
            const accessToken = localStorage.getItem("access_token");
            await axios.post('/data/text/content', data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            await fetchLoadData(type, filter, null, page, page_size);
        } catch (error) {
            console.error("Generate default data error", error);
        }
    }, [fetchLoadData]);

    return {
        dataList,
        dataContent,
        dataCount,
        fetchLoadData,
        fetchGetDataContent,
        fetchDeleteData,
        fetchUploadFile,
        fetchGenerateData,
        fetchUploadText,
    };
};