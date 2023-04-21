<template>
    <div id="container" class="h-full shadow-sm"></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { useTheme, changeWatermark } from '@/store/modules'
const themes = useTheme()
const amapKey = 'ade7faec217f922d983a664150ba0fe1';
let map = ref(null)
onMounted(() => {
    initMap()
})
const initMap = () => {
    AMapLoader.load({
        key: amapKey,             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [/* 'AMap.ToolBar', 'AMap.Driving', 'AMap.Weather', 'AMap.ElasticMarker' */],// 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
        init(AMap)
        setMapStyle(themes)
    }).catch(e => {
        console.log(e);
    })
}
const init = (AMap) => {
    // 创建地图实例
    map = new AMap.Map("container", {
        zoom: 13,
        center: [117.130394, 31.78212],
        resizeEnable: true,
    });
}
//改变地图的样式
const setMapStyle = (val) => {
    val = val.theme ? 'dark' : 'normal'
    var styleName = "amap://styles/" + val;
    map?.setMapStyle(styleName);
}
// 监听单个 state
watch(themes, (newX) => {
    setMapStyle(newX)
})
</script>