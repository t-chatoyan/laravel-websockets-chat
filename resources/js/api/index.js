import axios from 'axios';

export const baseURL = '/api/';


const http = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'client-id' : 'application-client'
    },
});
http.interceptors.request.use((config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'client-id' : 'application-client',
        ...config.headers,
    };
    if (localStorage.access_token) {
        config.headers.Authorization = `Bearer ${localStorage.access_token}`;
    }
    return config;
}, (error) => {
    console.error(error.status);
    return Promise.reject(error);
});

http.interceptors.response.use((response) => response, (error) => {
    if (error.response.status === 401) {
        window.location = '/#/login';
        localStorage.clear();
    }
    return Promise.reject(error);
});

export {
    http,
};
