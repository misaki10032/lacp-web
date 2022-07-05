import axiosBase from 'axios'
import router from "@/router"

const axios = axiosBase.create({
    timeout: 10000 * 12,
    baseURL: "http://124.222.34.234:27314/api",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})
const axios_interview = axiosBase.create({
    timeout: 10000 * 12,
    baseURL: "http://124.222.34.234:27315/api/lacp",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})

axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('sso_uid');
    return config;
})

axios.interceptors.response.use((res) => {
    if (res.data.message == 'session失效') {
        router.replace("/login");
    }
    return res;
});

axios_interview.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('sso_uid');
    return config;
})

axios_interview.interceptors.response.use((res) => {
    if (res.data.message == 'session失效') {
        router.replace("/login");
    }
    return res;
});

export {axios, axios_interview}