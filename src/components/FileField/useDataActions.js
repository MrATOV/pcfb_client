import { useState, useCallback } from 'react';
import axios from "/src/config/axiosLessonsConfig";

export const useDataActions = (type) => {
    const [dataList, setDataList] = useState([]);
    const [dataContent, setDataContent] = useState(null);

    const fetchLoadData = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("access_token");
            let url;
            if (!type || type === 'all') {
                url = '/data/list';
            } else {
                url = `/data/list/${type}`
            }
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            setDataList(response.data);
        } catch {
            console.error("Get default data error:", error);
        }
    }, []);
    
    const fetchGetDataContent = useCallback(async (type, filename) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (['array', 'matrix'].includes(type)) {
                setDataContent(filename);
            } else if (type === 'text') {
                const response = await axios.get(`/data/${type}/${filename}`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                setDataContent(response.data);
            } else {
                const response = await axios.get(`/data/${type}/${filename}`, {
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
            await fetchLoadData(type);
        } catch (error) {
            console.error("Delete data error:", error);
        }
    }, [fetchLoadData]);

    const fetchUploadFile = useCallback(async (data) => {
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
            await fetchLoadData();
        } catch (error) {
            console.error("Add default data error", error);
        }
    }, [fetchLoadData]);
    
    const fetchGenerateData = useCallback(async (generateData) => {
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
            await fetchLoadData();
        } catch (error) {
            console.error("Generate default data error", error);
        }
    }, [fetchLoadData]);

    const fetchUploadText = useCallback(async (generateData) => {
        
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
            await fetchLoadData();
        } catch (error) {
            console.error("Generate default data error", error);
        }
    }, [fetchLoadData]);

    return {
        dataList,
        dataContent,
        fetchLoadData,
        fetchGetDataContent,
        fetchDeleteData,
        fetchUploadFile,
        fetchGenerateData,
        fetchUploadText,
    };
};