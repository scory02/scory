import axios from "axios";
import {get} from "./server";
/**
 * 获取用户当前位置
 */
export function geolocation(callback) {
  //浏览器判断 是否支持 H5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  //坐标查询
  function showPosition(position) {
    var latitude = position.coords.latitude; //经度
    var longitude = position.coords.longitude; //维度
    /* var getCityList = geiLatlng(longitude, latitude);//调用查询  获取城市列表 */
    callback && callback([longitude, latitude]);
    /* return [longitude,latitude] */
  }
}
//获取位置权限
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('%c [ position ]-28', 'font-size:13px; background:pink; color:#bf2c9f;', position)
          resolve(position);
        },
        (error) => {
          console.log(2);
          alert("请允许此站点访问你的位置");
          reject(error);
        }
      );
    } else {
      console.log(3);
      alert("请允许此站点访问你的位置");
      reject("Geolocation is not supported by this browser.");
    }
  });
}
export function getCurrentIp() {
  return new Promise((resolve, reject) => {
    return get("https://api.ipify.org?format=json").then((res) => {
      resolve(res.data.ip);
    });
  });
}

export function getCityByIp(ip) {
    return new Promise((resolve, reject) => {
      return get(`https://ipapi.co/${ip}/json/`).then((res) => {
        resolve(res.data);
      });
    });
}

/**
 * 根据坐标查询城市
 * @param longitude 经度
 * @param latitude 纬度
 * result data[]
 * */
const amapKey = "ade7faec217f922d983a664150ba0fe1";
export function geiLatlng(longitude, latitude) {
  if (
    longitude != null &&
    latitude != null &&
    longitude != undefined &&
    latitude != undefined
  ) {
    var cityLsit = []; //城市列表
    var language = "CN"; //默认中文
    if (window.localStorage) {
      if (
        window.localStorage.languages != null &&
        window.localStorage.languages != undefined
      ) {
        language = window.localStorage.languages.value == "zh-en" ? "EN" : "CN"; //用户是否有自定义的语言
      }
    }

    axios
      .get(
        `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${amapKey}&radius=1000&extensions=all`
      )
      .then((res) => {
        console.log(res);
      });

    //根据坐标查询当前城市
    return cityLsit;
  }
}
