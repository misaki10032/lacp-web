import axiosBase from 'axios'
import router from "@/router"
import {MessageBox} from 'element-ui'

const axios = axiosBase.create({
    timeout: 10000 * 12,
    baseURL: "http://124.222.34.234:27314/api",
    // baseURL: "http://localhost:27314/api",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})
const axios_sso = axiosBase.create({
    timeout: 10000 * 12,
    baseURL: "http://124.222.34.234:27313/api",
    // baseURL: "http://localhost:27313/api",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})
const axios_interview = axiosBase.create({
    timeout: 10000 * 12,
    baseURL: "http://124.222.34.234:27315/api/lacp",
    // baseURL: "http://localhost:27315/api/lacp",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})

axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token');
    return config;
})

function fail(res) {
    if (res.data.message == 'session失效') {
        MessageBox.confirm("用户未登录或登录信息有误，即将跳转至登录页面!", "退出警告", {
            showClose: false,
            showCancelButton: false,
            confirmButtonText: "知道啦",
            type: "warning",
            distinguishCancelAndClose: true
        }).then(() => {
            router.replace("/login");
        }).catch(() => {
            router.replace("/login");
        })
    }
}

axios.interceptors.response.use((res) => {
    fail(res)
    return res;
});

axios_sso.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token');
    return config;
})

axios_sso.interceptors.response.use((res) => {
    fail(res)
    return res;
});

axios_interview.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token');
    return config;
})

axios_interview.interceptors.response.use((res) => {
    fail(res)
    return res;
});

export {axios, axios_interview, axios_sso}