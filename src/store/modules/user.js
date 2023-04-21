import { defineStore } from "pinia";
import Mock from "mockjs";
import { store } from '@/store';
import { ResultEnum } from "@/enums";
import { storage } from "@/utils/Storage";

const Random = Mock.Random;
const token = Random.string("upper", 32, 32);
export function resultSuccess(result, { message = "ok" } = {}) {
  return Mock.mock({
    code: 200,
    result,
    message,
    type: "success",
  });
}

export const useUserStore = defineStore({
  id: "app-user",
  state: () => ({
    islogin: storage.get("IS_LOGIN", false),
    info: storage.get("CURRENT_USER", {}),
  }),
  /* getters: {
    getIslogin() {
      const islogin=storage.get("IS_LOGIN", false)
      if(this.islogin!==islogin){
        this.islogin=islogin
      }
      console.log(islogin);
      return islogin;
    },
    getUserInfo() {
      const info=storage.get("CURRENT_USER", {})
      if(this.info!==info){
        this.info=info
      }
      return info;
    },
  }, */
  actions: {
    setIslogin(islogin) {
      this.islogin = islogin;
    },
    setUserInfo(info) {
      this.info = info;
    },
    getIslogin() {
      const islogin=storage.get("IS_LOGIN", false)
      if(this.islogin!==islogin){
        this.islogin=islogin
      }
      return islogin;
    },
    getUserInfo() {
      const info=storage.get("CURRENT_USER", {})
      if(this.info!==info){
        this.info=info
      }
      return info;
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await resultSuccess({ ...userInfo, token });
        const { result, code } = response;
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60;
          storage.set("CURRENT_USER", result, ex);
          storage.set("IS_LOGIN", true, ex);
          this.setIslogin(true);
          this.setUserInfo(result);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    GetInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const result = res;
            if (result.permissions && result.permissions.length) {
              const permissionsList = result.permissions;
              that.setPermissions(permissionsList);
              that.setUserInfo(result);
            } else {
              reject(
                new Error("getInfo: permissionsList must be a non-null array !")
              );
            }
            that.setAvatar(result.avatar);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    async logout() {
      this.setUserInfo("");
      storage.remove("CURRENT_USER");
      storage.remove("IS_LOGIN");
      return Promise.resolve("");
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
