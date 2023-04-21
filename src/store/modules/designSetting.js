import { defineStore } from 'pinia';
import { store } from '@/store';
import designSetting from '@/enums/designSetting';

const { darkTheme, appTheme, appThemeList,bgImg } = designSetting;

export const useDesignSettingStore = defineStore({
    id: 'app-design-setting',
    state: () => ({
        darkTheme,//深色主题
        appTheme,//系统风格
        appThemeList,//系统内置风格
        bgImg,
        deviceWidth: window.innerWidth,
    }),
    getters: {
        getDarkTheme() {
            return this.darkTheme;
        },
        getAppTheme() {
            return this.appTheme;
        },
        getAppThemeList() {
            return this.appThemeList;
        },
        getDeviceWidth() {
            return this.deviceWidth;
        },
    },
    actions: {
        setAppTheme(val) {
            this.darkTheme = val?.bool() || false
            window.this.setlocalStorage("darkTheme", this.darkTheme);
        },
        getbgImg() {
            return this.bgImg;
        },
        updateDeviceWidth: throttle(function() {
            this.deviceWidth = window.innerWidth;
        }, 1000),
    },
});


/* 字符串转bool */
String.prototype.bool = function () {
    return /^true$/i.test(this);
};
// Need to be used outside the setup
export function useDesignSettingWithOut() {
    return useDesignSettingStore(store);
}

function throttle(fn, delay) {
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(context, args);
                timer = null;
            }, delay);
        }
    };
}
