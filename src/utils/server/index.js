
import qs from 'qs'
import { set_CancelToken, CancelToken, myPromise } from '@/utils'
import { useRequestWithOut } from '@/store/modules/request'
import request from './request'
//get
export function get(url, params, callback) {
    const { error, cancelToken, index, timestamp } = set(url, params, callback)
    return new myPromise((resolve) => {
        if (!error) {
            request.get(url, { params, cancelToken }).then(res => {
                resolve(res)
                del(index, timestamp)
            }).catch(err => {
                resolve(err)
                del(index, timestamp)
            }).finally(() => {
                console.log('finally');
            });
        } else {
            resolve()
        }
    })
}
//post
export function post(url, data, callback) {
    const { error, cancelToken, index, timestamp } = set(url, data, callback)
    return new Promise(resolve => {
        if (!error) {
            request.post(url, data, cancelToken).then(res => {
                resolve(res)
                del(index, timestamp)
            }).catch(err => {
                resolve(err)
                del(index, timestamp)
            }).finally(() => {
                console.log('finally');
            });
        } else {
            resolve()
        }
    })
}
const store = useRequestWithOut()
/* 设置网络请求 */
function set(url, data, callback) {
    const { beforeRequestList } = store   /* 未请求-网络请求记录 */
    let params = [url, qs.stringify(data)]
    if (!beforeRequestList.includes(params)) {  /* 防止重复请求 */
        store.set_beforeRequestList(params); /* 未请求-的网络请求记录 */
        const { timestamp, cancelToken } = set_CancelToken(params)  /* 设置网络请求唯一编号和取消Token */
        if (typeof callback == "function") {
            callback(timestamp);    /* 回调返回网络请求唯一编号（取消Token） */
        }
        const index = beforeRequestList.indexOf(params)   /* 回调返回网络请求唯一编号（取消Token） */
        return { cancelToken, index, timestamp }
    } else {
        return { error: true }
    }
}
/* 删除某个网络请求 */
function del(index, timestamp) {
    store.del_beforeRequestList(index);
    store.del_requestListing(timestamp);
}