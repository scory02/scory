<template>
    <div id="viewer">
        <slot name="default" :show="show" :markerList="markerList"></slot>
        <div class="beian">
            <span style="font-family:arial;">Copyright &copy;scory </span>
            <n-divider vertical />
            <a href="https://beian.miit.gov.cn/" target="_blank" class="a">陕ICP备2023002971号-1</a>
            <n-divider vertical />
            <img src="/beian.png" class="w-5 h-5 inline mr-1" />
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=61102402611051" target="_blank"
                class="a">陕公网安备 61102402611051号</a>
        </div>
    </div>
</template>

<script setup>
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";
import { getTimestamp } from '@/utils/date';
let markersPlugin
// 全景视图
let panoramaViewer = null
let show = ref(true)
let mousehoverTimeout = ref(null)
let startAutorotateTimeout = ref(null)
// 注标列表
const list = JSON.parse(sessionStorage.getItem('markerList')) || []
const markerList = ref(list)
// 全景图初始化
const initViewer = async function () {
    panoramaViewer = new Viewer({
        container: 'viewer', // 容器
        panorama: '/vr.jpg',
        loadingTxt: "正在加载",
        navbar: null,/* [
            'autorotate',
            'zoom',
            'caption',
            'fullscreen'
        ], */
        plugins: [MarkersPlugin], // 标记点
        size: {
            width: '100%',
            height: '100%'
        },
        maxFov: 60,
        defaultZoomLvl: 0,
        defaultLong: 0,
        defaultLat: -Math.PI / 3,
        autorotateLat: "-0.4",
        autorotateDelay: 1000,
        autorotateSpeed: "0.4rpm",
    })
    markersPlugin = panoramaViewer.getPlugin(MarkersPlugin)
    readyEvents()
}
// 全景图加载完毕
const readyEvents = function () {
    // 加载完毕
    panoramaViewer.once('ready', () => {
        // 初始化标注坐标
        initMarkers()
        panoramaViewer.startAutorotate();
    })
    // 全景图点击事件
    panoramaViewer.on('click', (e, data) => {
        const { latitude, longitude, } = data
        const id = getTimestamp()
        const images = ['/cxk.gif', '/Gyroscope3.png']
        const width = 50
        const height = 50
        const marker = {
            longitude: longitude,
            latitude: latitude,
            image: images[Math.floor(Math.random() * images.length)],
            width,
            height,
            id,
        }
        markersPlugin.addMarker(marker)
        markerList.value.push(marker)
        sessionStorage.setItem('markerList', JSON.stringify(markerList.value))
    })

    //当鼠标滑动视图时触发
    panoramaViewer.on('before-rotate', () => {
        //开始收缩
        if (show.value && !mousehoverTimeout.value) {
            show.value = false;
        }

        if (mousehoverTimeout.value) {
            clearTimeout(mousehoverTimeout.value);
            mousehoverTimeout.value = undefined;
        }

        // 滑动结束会有 定时自动旋转，此时需要清理掉，等滑动结束再定时
        if (startAutorotateTimeout.value) {
            clearTimeout(startAutorotateTimeout.value);
            startAutorotateTimeout.value = undefined;
        }

        mousehoverTimeout.value = setTimeout(viwerOnRotateEnd, 1000);  // 滑动结束定时
    })
    //当视图经度和/或纬度改变时触发
    /*  panoramaViewer.on('position-updated', (e, position) => {
         // 全景图位置变化时 也就是旋转时会把显示的标注tooltip内容隐藏 这里停止旋转时 让这部分标注tooltip重新展示
         // config.tooltip?.visible是手动添加的变量 用来判断标注的tooltip是否显示
         if (markersPlugin && markersPlugin.markers) setTimeout(() => {
           Object.keys(markersPlugin.markers).forEach((id) => {
             if (markersPlugin.markers[id].config.tooltip?.visible) markersPlugin.markers[id]['showTooltip']()
           })
         }, 300)
     }); */
    // 选中标注事件
    markersPlugin.on('select-marker', (e, marker) => {
    })
}
// 滑动结束
function viwerOnRotateEnd() {
    mousehoverTimeout.value = undefined;
    startAutorotateTimeout.value = setTimeout(viewerOnStartAutoRotate, 1000);
    show.value = true;
}

// 开始自动旋转
function viewerOnStartAutoRotate() {
    if (startAutorotateTimeout.value) startAutorotateTimeout.value = undefined;
    if (panoramaViewer && !panoramaViewer.isAutorotateEnabled()) {
        panoramaViewer.startAutorotate();
    }
}
// 停止旋转，用于启动热点时。操作地图时是自动停止旋转的
function viewerOnStopAutoRotate() {
    if (panoramaViewer && panoramaViewer.isAutorotateEnabled()) {
        panoramaViewer.stopAutorotate();
    }
}
// 初始化标注坐标
const initMarkers = async function () {
    markersPlugin?.clearMarkers()
    markerList.value.forEach(item => {
        markersPlugin?.addMarker(item)
    })
}

onMounted(() => {
    initViewer()
})
onBeforeUnmount(() => {
    panoramaViewer?.destroy() // 销毁全景图
})
</script>

<style lang="less">
#viewer {
    .psv-container {
        position: absolute;
    }

    .psv-canvas-container {
        width: 100% !important;

        .psv-canvas {
            width: 100% !important;
        }
    }
}
</style>