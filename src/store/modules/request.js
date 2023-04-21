import { defineStore } from 'pinia';
import { store } from '@/store';

export const useRequest = defineStore({
    id: 'useRequest',
    state: () => ({
        requestList: {},//所有网络请求的记录
        requestListing: {},//网络请求中的记录(请求中)
        beforeRequestList: [],//网络(重复请求)之前的记录(未请求)->防止重复请求
    }),
    getters: {
        getrequestList() {
            return this.requestList;
        },
        getrequestListing() {
            return this.requestListing;
        },
        getbeforeRequestList() {
            return this.beforeRequestList;
        },
    },
    actions: {
        set_requestList(val) {
            console.log(val);
            this.requestList = val
            this.requestListing = val
        },
        del_requestListing(value){
            delete this.requestListing[value]
        },
        set_beforeRequestList(data) {
            this.beforeRequestList.push(data)
        },
        del_beforeRequestList(index) {
            this.beforeRequestList.splice(index, 1)
        },
    },
});
// Need to be used outside the setup
export function useRequestWithOut() {
    return useRequest(store);
}
