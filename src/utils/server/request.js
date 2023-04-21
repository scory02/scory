import axios from 'axios'
import plugins from '@/plugins';
const { setupNaiveDiscreteApi } = plugins;
const { message, notification, loadingBar } = setupNaiveDiscreteApi()
import router from '@/router'
import {geturlList,urlList } from '@/utils'
const duration = 2 * 1000
let messageList = []
/**
 * 创建axios实例
 * @param {*} 
 * 设置请求体类型 headers:{'Content-Type':'application/json': 发送JSON对象/'multipart/form-data': 需要文件上传时，就使用该格式}
 */
const request = axios.create({
    baseURL: geturlList()?.baseURL, //URL地址
    timeout: 5 * 1000,//超时
    headers: {
        'Content-Type': 'application/json;charset=UTF-8', // 设置请求体类型 'application/json': 发送JSON对象 'multipart/form-data': 需要文件上传时，就使用该格式
        /*
        常用的请求格式有：
        根据后台需求发送其他需要放在header里面数据，例如：
            'Authorization': 'Basic ****', //登录验证
        */
        'Authorization': localStorage.getItem('token') || null,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': urlList?.baseURL
    },
    // 默认情况下，后台状态码不返回200的话，是不会收到返回数据的，可以根据需要设置后台返回状态码的区间
    validateStatus: function (status) {
        return status >= 200 && status <= 500;
    },
    onUploadProgress: function ({ loaded, total, progress, bytes, estimated, rate, upload = true }) {
        //console.log(`Upload [${(progress * 100).toFixed(2)}%]: ${(rate / 1024).toFixed(2)}KB/s`, "上传中")
        // Do whatever you want with the Axios progress event
    },//上传进度
    onDownloadProgress: function ({ loaded, total, progress, bytes, estimated, rate, download = true }) {
        //console.log(`Download [${(progress * 100).toFixed(2)}%]: ${(rate / 1024).toFixed(2)}KB/s`, "下载中")
        // Do whatever you want with the Axios progress event
    },//下载进度
    proxy: {
        protocol: 'https',
        host: '127.0.0.1',
        // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
        port: 9000,
        auth: {
            username: 'mikeymike',
            password: 'rapunz3l'
        }
    },
})
// 请求拦截器
request.interceptors.request.use(
    config => {
        /* let token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token; // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
        } */
        // 开启进度条
        loadingBar.start();
        return config
    },
    error => {
        loadingBar.error()
        return Promise.reject(repError(error))
    }
)
// 响应拦截器
request.interceptors.response.use(
    res => {
        if (res) {
            // 关闭进度条
            loadingBar.finish()
                
            return Promise.resolve(repSuccess(res))
        }
    },
    error => {
        loadingBar.error()
        return Promise.reject(repError(error))
    }
)

export default request

const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}
/**
 * 处理相同内容多次弹出弹框
 * @param {*} message.error(content -提示内容, [duration] -自动关闭的延时，单位秒。设为 0 时不自动关闭, onClose -关闭时触发的回调函数)
 */
const Message = (msg) => {
    if (!messageList.includes(msg)) {
        messageList.push(msg)
        message.error(msg, {
            duration, onLeave: () => {
                const index = messageList?.findIndex((i) => i == msg)
                messageList?.splice(index, 1)
            }
        })
    };
}
/**
 * 请求成功处理
 * @param {*} rep
 */
const repSuccess = (res) => {
    if (!res) {
        return repError()
    }
    const { status, data } = res
    // 未设置状态码则默认成功状态
    const code = Number(status) || 200
    // 获取错误信息
    const msg = res?.data?.msg || errorCode[code] || errorCode['default']
    if (code === 401) {
        toLogin()
    } else if (code === 500) {
        Message(msg)
    } else if (code !== 200) {
        notification.error({
            meta: "error",
            content: msg,
            duration,
            keepAliveOnHover: true
        })
    }
    let rep = {
        error: false,
        data
    }
    return rep
}
/**
 * 请求失败处理
 * @param {*} data
 */
const repError = (error) => {
    ErrorMessage(error)
    let data = {
        error: true,
        msg: error?.message || '数据请求失败',
    }
    return data
}
/**
 * 错误信息汇总
 * @param {*} error
 */
const ErrorMessage = (error) => {
    if (error) {
        console.log('[ error ] >', error)
        switch (error.message) {
            case 'Internal Server Error':
                Message('服务器升级中，请稍后再试');
                break;
            case 'Network Error':
                Message('请求失败，请检查您的网络,可能无法访问某些网络资源!');
                break;
            case 'canceled':
                Message('取消请求');
                break;
            case 'Request failed with status code 200':
                Message('请求失败');
                break;
            case (/timeout/.test(error.message) ? error.message :
                false):
                Message('请求超时，请稍后重试');
                break;
            default:
                Message(error.message || '请求失败');
        }
    } else {
        if (!window.navigator.onLine) {
            Message('网络连接错误');
        } else {
            Message('请求失败');
        }
    }
}
const errorCode = {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误,请反馈给管理员'
}