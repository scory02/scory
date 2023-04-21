import { h } from "vue";
import axios from "axios";
import router from "@/router";
import { getTimestamp } from "./date";
import { useRequestWithOut } from "@/store/modules/request";
import { NIcon } from "naive-ui";
function addLight(color, amount) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}
/* 取颜色 */
export function lighten(color, amount) {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}

/* 渲染图标 */
export const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export let urlList = {};
/**
 * 判断是否 url
 * */
export function isUrl(url) {
  return /^(http|https):\/\//g.test(url);
}

//获取本地json里的urls
export function geturlList() {
  const modules = import.meta.globEager("/public/config.json");
  const key = Object.keys(modules)[0];
  urlList = modules[key].default;
  return modules[key].default || {};
}
/* 监听窗口变化事件 */
export function resize(Dom) {
  console.log(Dom);
  window.addEventListener("resize", () => {
    Dom.resize();
  });
}

export const logout = () => {
  localStorage?.clear();
  sessionStorage?.clear();
  router?.replace("/login");
};
// 设置本地存储
export function setlocalStorage(key, value) {
  if (key && value) localStorage.setItem(key, JSON.stringify(value));
}
// 获取本地存储
export function getlocalStorage(key) {
  if (key) return JSON.parse(localStorage.getItem(key));
}
// 设置本地强缓存
export function setsessionStorage(key, value) {
  if (key && value) sessionStorage.setItem(key, JSON.stringify(value));
}
// 获取本地强缓存
export function getsessionStorage(key) {
  if (key) return JSON.parse(sessionStorage.getItem(key));
}

const store = useRequestWithOut();
//记录请求
export function set_CancelToken(val) {
  let timestamp = getTimestamp();
  timestamp += val;
  //所有请求进行设置cancelToken，并统一存放。
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  let cancelToken = source.token;
  store.set_requestList({
    [timestamp]: source,
  }); /* 网络请求记录 */
  return { timestamp, cancelToken };
}
//取消所有请求中的请求
export function CancelToken(timestamp) {
  const { requestList, requestListing } = store;
  if (!timestamp) {
    let keys = Object.keys(requestListing).sort();
    keys?.map((item, index) => {
      if (requestListing[item]) {
        requestListing[item].cancel("canceled");
        delete requestListing[item];
      }
    });
  } else {
    if (typeof timestamp == "string" && requestListing[timestamp]) {
      // 取消单个请求
      requestListing[timestamp].cancel("canceled");
      delete requestListing[timestamp];
    } else if (typeof timestamp == "object") {
      if (timestamp.length > 0) {
        timestamp.map((item, index) => {
          if (requestListing[item]) {
            requestListing[item].cancel("canceled");
            delete requestListing[item];
          }
        });
      }
    }
  }
}
//Promise
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
export class myPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failCallback = [];

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    while (this.successCallback.length) {
      this.successCallback.shift()(this.value);
    }
  };

  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while (this.failCallback.length) {
      this.failCallback.shift()(this.reason);
    }
  };

  then(successCallback, failCallback) {
    let thenPromise = new myPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        let x = successCallback(this.value);
        argParsing(x, resolve, reject);
      } else if (this.status === REJECTED) {
        let x = failCallback(this.reason);
        argParsing(x, resolve, reject);
      } else {
        this.successCallback.push(successCallback);
        this.failCallback.push(failCallback);
      }
    });
    return thenPromise;
  }
}
function argParsing(x, resolve, reject) {
  if (x instanceof myPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

/**
 * ipv4
 * 局域网地址
 * 局域网网关
 */
export const getIPs = (callback) => {
  var ip_dups = {};
  var RTCPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  var useWebKit = !!window.webkitRTCPeerConnection;
  var mediaConstraints = {
    optional: [{ RtpDataChannels: true }],
  };
  // 这里就是需要的ICEServer了
  var servers = {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };
  var pc = new RTCPeerConnection(servers, mediaConstraints);
  function handleCandidate(candidate) {
    var ip_regex =
      /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
    var hasIp = ip_regex.exec(candidate);
    if (hasIp) {
      var ip_addr = ip_regex.exec(candidate)[1];
      if (ip_dups[ip_addr] === undefined) callback(ip_addr);
      ip_dups[ip_addr] = true;
    }
  }
  // 网络协商的过程
  pc.onicecandidate = function (ice) {
    if (ice.candidate) {
      handleCandidate(ice.candidate.candidate);
    }
  };
  pc.createDataChannel("");
  //创建一个SDP(session description protocol)会话描述协议 是一个纯文本信息 包含了媒体和网络协商的信息
  pc.createOffer(
    function (result) {
      pc.setLocalDescription(
        result,
        function () {},
        function () {}
      );
    },
    function () {}
  );
  setTimeout(function () {
    var lines = pc.localDescription && pc.localDescription.sdp.split("\n");
    lines &&
      lines.forEach(function (line) {
        if (line.indexOf("a=candidate:") === 0) handleCandidate(line);
      });
  }, 1000);
};
/**
 * 浏览器信息
 */
export const getBrowserInfo = () => {
  let browserReg = {
    Chrome: /Chrome/,
    IE: /MSIE/,
    Firefox: /Firefox/,
    Opera: /Presto/,
    Safari: /Version\/([\d.]+).*Safari/,
    360: /360SE/,
    QQBrowswe: /QQ/,
    Edge: /Edg/,
  };
  let deviceReg = {
    iPhone: /iPhone/,
    iPad: /iPad/,
    Android: /Android/,
    Windows: /Windows/,
    Mac: /Macintosh/,
  };
  let userAgentStr = navigator.userAgent;
  const userAgentObj = {
    browserName: "", // 浏览器名称
    browserVersion: "", // 浏览器版本
    osName: "", // 操作系统名称
    osVersion: "", // 操作系统版本
    deviceName: "", // 设备名称
  };
  for (let key in browserReg) {
    if (browserReg[key].test(userAgentStr)) {
      userAgentObj.browserName = key;
      if (key === "Chrome") {
        userAgentObj.browserVersion = userAgentStr
          .split("Chrome/")[1]
          .split(" ")[0];
      } else if (key === "IE") {
        userAgentObj.browserVersion = userAgentStr
          .split("MSIE ")[1]
          .split(" ")[1];
      } else if (key === "Firefox") {
        userAgentObj.browserVersion = userAgentStr.split("Firefox/")[1];
      } else if (key === "Opera") {
        userAgentObj.browserVersion = userAgentStr.split("Version/")[1];
      } else if (key === "Safari") {
        userAgentObj.browserVersion = userAgentStr
          .split("Version/")[1]
          .split(" ")[0];
      } else if (key === "360") {
        userAgentObj.browserVersion = "";
      } else if (key === "QQBrowswe") {
        userAgentObj.browserVersion = userAgentStr
          .split("Version/")[1]
          .split(" ")[0];
      } else if (key === "Edge") {
        userAgentObj.browserVersion = userAgentStr
          .split("Edg/")[1]
          .split(" ")[0];
      }
    }
  }

  for (let key in deviceReg) {
    if (deviceReg[key].test(userAgentStr)) {
      userAgentObj.osName = key;
      if (key === "Windows") {
        userAgentObj.osVersion = userAgentStr
          .split("Windows NT ")[1]
          .split(";")[0];
      } else if (key === "Mac") {
        userAgentObj.osVersion = userAgentStr
          .split("Mac OS X ")[1]
          .split(")")[0];
      } else if (key === "iPhone") {
        userAgentObj.osVersion = userAgentStr
          .split("iPhone OS ")[1]
          .split(" ")[0];
      } else if (key === "iPad") {
        userAgentObj.osVersion = userAgentStr
          .split("iPad; CPU OS ")[1]
          .split(" ")[0];
      } else if (key === "Android") {
        userAgentObj.osVersion = userAgentStr
          .split("Android ")[1]
          .split(";")[0];
        userAgentObj.deviceName = userAgentStr
          .split("(Linux; Android ")[1]
          .split("; ")[1]
          .split(" Build")[0];
      }
    }
  }
  return userAgentObj;
};
export const getNetworkIp = () => {
  let needHost = "";
  try {
    const os = require("os");
    // 获得网络接口列表
    let network = os.networkInterfaces();
    for (let item in network) {
      let iface = network[item];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    needHost = "localhost";
  }
  return needHost;
};
export function loadJS(url, callback) {
  let script = document.createElement("script"),
    fn = callback || function () {};
  script.type = "text/javascript";
  //IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    //其他浏览器
    script.onload = () => {
      fn();
    };
    script.onerror = () => {
      console.log("加载错误");
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

/*  移除css/js文件 */
export function removejscssfile(filename, filetype) {
  var targetelement =
    filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
  var targetattr =
    filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
  var allsuspects = document.getElementsByTagName(targetelement);
  for (var i = allsuspects.length; i >= 0; i--) {
    const file = allsuspects[i];
    if (
      file &&
      file.getAttribute(targetattr) != null &&
      file.getAttribute(targetattr).indexOf(filename) != -1
    )
      file.parentNode.removeChild(file);
  }
}

export const server ={
  host: '124.222.156.92',
  port: 3389,
  username: 'Administrator',
  password: 'Scory02110829',
  path: '/wwwroot/VNV3', // 项目放置静态地址（服务器中地址）
  command: 'rm -rf /wwwroot/VNV3/*', // 删除命令
}