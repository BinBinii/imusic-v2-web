import { ResultEnum } from '../enums/httpEnum';
import axios from 'axios'
import { useUserStore } from '../store/modules/user'
import { storage } from '../utils/Storage';
import { ACCESS_TOKEN } from '../store/mutation-types';

// 创建axios
const $http = axios.create({
    //设置默认请求地址
    baseURL: '/music',
    //设置请求超时时间
    timeout: 5000,
    //设置请求头
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
$http.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = 'Bearer ' + userStore.getToken;
    config.headers.Authorization = token
    return config
}, error => {
    return Promise.reject(error);
})

//响应拦截
$http.interceptors.response.use(res => {
    const userStore = useUserStore()
    const { data } = res;
    const { code, message } = data;
    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
        return res;
    }
    if (code === ResultEnum.LOGIN_EXPIRED) {
        refreshToken().then(refreshRes => {
            let {accessToken, refreshToken} = refreshRes.data.result
            userStore.setToken(accessToken);
            userStore.setRefreshToken(refreshToken);
            storage.set(ACCESS_TOKEN, accessToken, 1 * 24 * 60 * 60)
            
            const token = 'Bearer ' + accessToken;
            res.config.headers.Authorization = token
            return axios.request(res.config)
        })
    }
    // 接口请求错误
    let errorMsg = message
    switch (code) {
        case ResultEnum.ERROR:
            break;
        case ResultEnum.TIMEOUT:
            break;
    }
    throw new Error(errorMsg)
}, error => {
    const userStore = useUserStore()
    let code = error.response.data.code
    if (code === ResultEnum.LOGIN_EXPIRED) {
        refreshToken().then(res => {
            let {accessToken, refreshToken} = res.data.result
            userStore.setToken(accessToken);
            userStore.setRefreshToken(refreshToken);
            storage.set(ACCESS_TOKEN, accessToken, 1 * 24 * 60 * 60)

            const token = 'Bearer ' + userStore.getToken;
            error.response.config.headers.Authorization = token
            return axios.request(error.response.config)
        })
    }
    return Promise.reject(error);
})

function refreshToken() {
    const userStore = useUserStore()
    const refreshToken = userStore.getRefreshToken;
    userStore.setToken(refreshToken)
    return $http.request({
        url: '/auth/refresh',
        method: 'post'
    })
}

// 导出封装的axios
export default $http
