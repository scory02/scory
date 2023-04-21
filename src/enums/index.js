import { NButton } from "naive-ui";
import { useUnity } from "@/store/modules";
/* unity地址 */
export const unityEnum = [
  {
    label: "中然",
    key: "zr",
    top: true,
    children: [
      {
        label: "组态",
        key: "zutai",
        sendMessage: ["ReceiveWeb", "ChangeZT"],
        suffix: () => {
          const store = useUnity();
          return [
            h(
              "div",
              { style: "gap:10px;display:flex;" },
              h(
                NButton,
                {
                  text: true,
                  type: "primary",
                  value: "0",
                  onClick: (e) => {
                    e.stopPropagation(); //阻止事件冒泡
                    if(store.currentUnity.includes('zutai')) store.change("0");
                  },
                },
                { default: () => "场景1" }
              ),
              h(
                NButton,
                {
                  text: true,
                  type: "primary",
                  value: "1",
                  onClick: (e) => {
                    e.stopPropagation(); //阻止事件冒泡
                    if(store.currentUnity.includes('zutai')) store.change("1");
                  },
                },
                { default: () => "场景2" }
              )
            ),
          ];
        },
      },
      {
        label: "三维标准站",
        key: "swbzz",
      },
    ],
  },
  {
    label: "站点",
    key: "gw",
    top: true,
    children: [
      {
        label: "站点集合",
        key: "home",
        sendMessage: ["EditManager", "LoadMR"],
        suffix: () => {
          const store = useUnity();
          return [
            h(
              "div",
              { style: "gap:10px;display:flex;" },
              h(
                NButton,
                {
                  text: true,
                  type: "primary",
                  value: "0",
                  onClick: (e) => {
                    e.stopPropagation(); //阻止事件冒泡
                    if(store.currentUnity.includes('home')) store.change("wuhu");
                  },
                },
                { default: () => "芜湖站" }
              ),
              h(
                NButton,
                {
                  text: true,
                  type: "primary",
                  value: "1",
                  onClick: (e) => {
                    e.stopPropagation(); //阻止事件冒泡
                    if(store.currentUnity.includes('home')) store.change("jinxiu");
                  },
                },
                { default: () => "锦绣站" }
              ),
              h(
                NButton,
                {
                  text: true,
                  type: "primary",
                  value: "1",
                  onClick: (e) => {
                    e.stopPropagation(); //阻止事件冒泡
                    if(store.currentUnity.includes('home')) store.change("guquan");
                  },
                },
                { default: () => "古泉站" }
              )
            ),
          ];
        },
      },
      {
        label: "编辑器",
        key: "editor",
        sendMessage: ["SceneManagement", "OpenEditorScene"],
      },
    ],
  },
];
/**
 * @description: 请求结果集
 */
export const ResultEnum = {
  SUCCESS: 200,
  ERROR: -1,
  TIMEOUT: 10042,
  TYPE: "success",
};

/**
 * @description: 请求方法
 */
export const RequestEnum = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};

/**
 * @description:  常用的contentTyp类型
 */
export const ContentTypeEnum = {
  // json
  JSON: "application/json;charset:UTF-8",
  // json
  TEXT: "text/plain;charset:UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED: "application/x-www-form-urlencoded;charset:UTF-8",
  // form-data  上传
  FORM_DATA: "multipart/form-data;charset:UTF-8",
};
/* menu 菜单配置（可配置） */
export const menu = {
  prop: {
    key: "path",
    label: "name",
    children: "children",
    title: "title",
  }, //字段映射
  key: "meunlocal", //本地存储名
};
/* words 验证码取值（可配置） */
export const words =
  "1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
/* 项目名称 */
export const appName = "国家机密";
/** 百度地图sdk地址 */
export const BAIDU_MAP_SDK_URL = `https://api.map.baidu.com/getscript?v=3.0&ak=KSezYymXPth1DIGILRX3oYN9PxbOQQmU&services=&t=20210201100830&s=1`;

/** 高德地图sdk地址 */
export const GAODE_MAP_SDK_URL =
  "https://webapi.amap.com/maps?v=2.0&key=e7bd02bd504062087e6563daf4d6721d";

/** 腾讯地图sdk地址 */
export const TENCENT_MAP_SDK_URL =
  "https://map.qq.com/api/gljs?v=1.exp&key=A6DBZ-KXPLW-JKSRY-ONZF4-CPHY3-K6BL7";
