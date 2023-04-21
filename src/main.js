import { createApp } from 'vue'
import "tailwindcss/tailwind.css";
import './style.css'
import "uno.css";
import App from './App.vue'
import { setupStore } from '@/store';
import {setupEcharts} from "@/utils/echarts";
import plugins from '@/plugins';
import * as utils from "@/utils";
import {get,post} from "@/utils/server";
import router, { setupRouter } from './router';

import {cloneDeep, debounce,trimEnd,difference,last,isEmpty} from 'lodash-es'

async function setupApp() {
    const app = createApp(App);
    setupStore(app)
    const { setupDirectives, setupNaive } = plugins;
    setupDirectives(app)
    setupNaive(app)
    setupEcharts(app)
    // 挂载路由
    setupRouter(app);
    await router.isReady();
    setWindow(app);
    app.mount('#app')
}

const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);
(async () => {
    await setupApp();
    const NODE_ENV = {
        dev: "development", //开发环境
        prod: "production", //生产环境
    };
    /* if (process.env.NODE_ENV === NODE_ENV.prod) {
        console = {log: function () { },error: function () { },dir: function () { }};
        alert = function () { };
    } */
    //禁止鼠标右键菜单
    document.oncontextmenu = function (e) {
        e.preventDefault();
    };
    // 判断当前设备是还是移动端
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    if (isMobile) {
        console.log('当前设备是移动端');
    } else {
        console.log('当前设备是PC端');
    }
})()

async function setWindow(app) {
    window['get']=get
    window['post']=post
    window['this'] = {cloneDeep, debounce,trimEnd,difference,last,isEmpty}
    Object.keys(utils).map((item) => {
        window['this'][item] = utils[item];
    });
    /* app.config.globalProperties = window['this']; */ //全局绑定
}
