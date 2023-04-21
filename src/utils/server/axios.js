
import { createLoading } from 'naive-ui'
import axios from 'axios'

// 封装 axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const loading = createLoading({
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    loading.open()
    config.loading = loading
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    response.loading.close()
    const res = response.data
    if (res.code !== 200) {
      console.log(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 对响应错误做点什么
    console.log('err' + error) // for debug
    error.loading.close()
    return Promise.reject(error)
  }
)

// get 请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// post 请求
export function post(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 取消请求
export function cancelRequest() {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  return source
}

// 下载文件
export function downloadFile(url, params, fileName) {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params,
      responseType: 'blob'
    })
      .then(res => {
        const blob = new Blob([res.data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

