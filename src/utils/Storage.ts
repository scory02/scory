// 默认缓存期限为7天
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 * @param {Object} [storage=localStorage] - sessionStorage | localStorage
 */
export const createStorage = ({ prefixKey = '', storage = localStorage } = {}) => {
  /**
   * 本地缓存类
   * @class Storage
   */
  const Storage = class {
    private storage = storage;
    private prefixKey?: string = prefixKey;

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * @description 设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @param expire
     */
    set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      });
      this.storage.setItem(this.getKey(key), Crypto.set(stringData));
    }

    /**
     * 读取缓存
     * @param {string} key 缓存键
     * @param {*=} def 默认值
     */
    get(key: string, def: any = null) {
      const item = this.storage.getItem(this.getKey(key));
      if (item) {
        try {
          const data = JSON.parse(Crypto.get(item));
          const { value, expire } = data;
          // 在有效期内直接返回
          if (expire === null || expire >= Date.now()) {
            return value;
          }
          this.remove(key);
        } catch (e) {
          return def;
        }
      }
      return def;
    }

    /**
     * 从缓存删除某项
     * @param {string} key
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * 清空所有缓存
     * @memberOf Cache
     */
    clear(): void {
      this.storage.clear();
    }

    /**
     * 设置cookie
     * @param {string} name cookie 名称
     * @param {*} value cookie 值
     * @param {number=} expire 过期时间
     * 如果过期时间未设置，默认关闭浏览器自动删除
     * @example
     */
    setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
      document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
    }

    /**
     * 根据名字获取cookie值
     * @param name
     */
    getCookie(name: string): string {
      const cookieArr = document.cookie.split('; ');
      for (let i = 0, length = cookieArr.length; i < length; i++) {
        const kv = cookieArr[i].split('=');
        if (kv[0] === this.getKey(name)) {
          return kv[1];
        }
      }
      return '';
    }

    /**
     * 根据名字删除指定的cookie
     * @param {string} key
     */
    removeCookie(key: string) {
      this.setCookie(key, 1, -1);
    }

    /**
     * 清空cookie，使所有cookie失效
     */
    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          document.cookie = keys[i] + '=0;expire=' + new Date(0).toUTCString();
        }
      }
    }
  };
  return new Storage();
};

export const storage = createStorage();

export default Storage;

import CryptoJS from "crypto-js";
/* ----数据加密 */
const KeyId = "ahxtofyyl";
export const Crypto = {
  //加密数据
  set(array) {
    if (array && array !== 'null' && array !== ' ' && array !== void (0)) {
      let encJson = CryptoJS.AES.encrypt(array, KeyId).toString();
      //对加密数据进行base64处理, 原理：就是先将字符串转换为utf8字符数组，再转换为base64数据
      let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
      return encData
    }
  },
  //解密数据
  get(array) {
    if (array && array !== 'null' && array !== ' ' && array !== void (0)) {
      //将数据先base64还原，再转为utf8数据
      let decData = CryptoJS.enc.Base64.parse(array).toString(CryptoJS.enc.Utf8);

      let decJson = CryptoJS.AES.decrypt(decData, KeyId).toString(CryptoJS.enc.Utf8);
      return decJson
    }
  },
};