import { defineStore } from "pinia";
import { appName } from "@/enums";

export const changeWatermark = defineStore("watermark", () => {
  let watermark = ref(getState("watermark") || appName);
  function change(value) {
    watermark.value = 'scory'+value;
    window.this.setlocalStorage("watermark", value);
  }
  return { watermark, change };
});
export const useTheme = defineStore("theme", () => {
  let theme = ref(getState("theme")?.bool()) || ref(null);
  function change(value) {
    theme.value = value;
    window.this.setlocalStorage("theme", value?.toString()); /* 数据持久化 */
  }
  return { theme, change };
});
export const useUnity = defineStore("Unity", () => {
  let Unity = ref(getState("Unity")) || ref("room"); //当前Unity传参
  const unityURL = ref(window.this.trimEnd(window.this.geturlList().unityURL, "/")); //Unity地址url
  const URL = (getState("URL") && ref(unityURL.value + getState("URL"))) || ref(unityURL.value + "/gw/home/"); //Unity地址url拼接
  let currentUnity = ref(getState("URL")||''); //当前Unity场景地址
  let sendMessage = ref(getState("sendMessage")||[]); //当前Unity场景地址-发送指令
  function change(value) {
    Unity.value = value?.toString();
    window.this.setlocalStorage("Unity", value?.toString()); /* 数据持久化 */
  }
  function setSendMessage(value) {
    sendMessage.value = value?.toString();
    window.this.setlocalStorage("sendMessage", value?.toString()); /* 数据持久化 */
  }
  function changeUrl(value) {
    URL.value = unityURL.value + value;
    currentUnity.value = value?.toString();
    window.this.setlocalStorage("URL", value?.toString()); /* 数据持久化 */
  }
  return { Unity, URL,currentUnity,sendMessage, change, changeUrl,setSendMessage };
});
/* 获取本地缓存 */
function getState(state) {
  return window?.this?.getlocalStorage([state]);
}
/* 字符串转bool */
String.prototype.bool = function () {
  return /^true$/i.test(this);
};
// 监听单个 state
watch(window.this, (newX) => {
  console.log(newX);
});
