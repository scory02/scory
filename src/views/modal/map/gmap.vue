<template>
    <div>
        <div id="gmap" @contextmenu="handleContextMenu"></div>
        <div class="right_box" v-draggable>
            <n-gradient-text :size="24" type="success">
                高德地图
            </n-gradient-text>
            <n-button dashed v-throttle="() => router.push('manage')" size="tiny">
                回到首页
            </n-button>
            <n-button dashed v-throttle="initMap" size="tiny">
                创建地图
            </n-button>
            <n-button dashed v-throttle="destroyMap" size="tiny">
                销毁地图
            </n-button>
            <n-select multiple size="tiny" v-model:value="markerValue" :options="markerOptions"
                @update:value="setMarkerOptions" placeholder="请选择覆盖物" />
            <n-button dashed @click="clearMap(markerList)" size="tiny">
                清除所有标记
            </n-button>
            <n-button dashed size="tiny" v-throttle="moveAlong">
                轨迹回放
            </n-button>
            <n-switch v-model:value="Autopilot">
                <template #checked>
                    自动驾驶
                </template>
                <template #unchecked>
                    手动驾驶
                </template>
            </n-switch>
            <n-switch v-model:value="follow">
                <template #checked>
                    跟随镜头
                </template>
                <template #unchecked>
                    不跟随镜头
                </template>
            </n-switch>
            <n-select v-model:value="theme" @update:value="setMapStyle" size="tiny"
                :options="options.filter(p => p.key == 'theme')[0].children" />
        </div>
        <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
            :on-clickoutside="onClickoutside" @select="handleSelect" />
        <n-modal v-model:show="Modal.visible" preset="dialog" :title="title">
            <n-form v-if="Modal.state !== 'read'" ref="formRef" :label-width="80" :model="formValue" :rules="rules">
                <n-space vertical>
                    <n-form-item label="标题" path="title">
                        <n-input v-model:value="formValue.title" type="text" placeholder="请输入标题" />
                    </n-form-item>
                    <n-form-item label="内容" path="textarea">
                        <n-input v-model:value="formValue.textarea" type="textarea" placeholder="请输入内容" />
                    </n-form-item>
                </n-space>
            </n-form>
            <template v-else>
                <n-card :title="formValue.title" embedded :bordered="false">
                    <template #header-extra>
                        {{ formValue.date }}
                    </template>
                    {{ formValue.textarea }}
                </n-card>
            </template>
            <xgplayer v-if="Modal.state == 'read'"
                url='https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4' />
            <template #action v-if="Modal.state !== 'read'">
                <n-button type="success" size="small" @click="submitCallback">
                    确认
                </n-button>
            </template>
        </n-modal>
    </div>
</template>
  
<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import generatePassword from "@/utils/pwd";
import xgplayer from "@/views/modal/video/xg.vue";
import { useTheme, } from '@/store/modules'
import Mock from "mockjs";
const Random = Mock.Random;
const themes = useTheme()
const router = useRouter();
const amapKey = 'ade7faec217f922d983a664150ba0fe1';
const state = reactive({
    path: [], //所有点击后的折线数据
    current_position: [], //当前点击的地理位置
    markerList: [],  //所有点标记覆盖物
    polylineList: [] //所有线标记覆盖物
});
//高德map插件
const plugin = [
    'AMap.CitySearch',// 搜索
    'AMap.Geolocation',// 高精度定位
    'AMap.MoveAnimation',// 使用覆盖物动画必须先加载动画插件
    'AMap.Autocomplete', // 输入提示插件
    'AMap.PlaceSearch', // POI搜索插件
    'AMap.Scale', // 右下角缩略图插件 比例尺
    'AMap.OverView', // 地图鹰眼插件
    'AMap.HawkEye',//显示缩略图
    'AMap.ControlBar',//增加3d控制罗盘
    'AMap.ToolBar', // 地图工具条
    'AMap.MapType', // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    'AMap.PolyEditor', // 编辑 折线多，边形
    'AMap.CircleEditor', // 圆形编辑器插件
    'AMap.Geolocation' // 定位控件，用来获取和展示用户主机所在的经纬度位置
]
//所有覆盖物类别
const markerOptions = [{
    label: "点标记",
    value: "marker",
    onclick: changeModal
}, {
    label: "线路",
    value: "polyline",
    onclick: (lnglat) => {
        lnglat && state.path.push(lnglat);
        addPolyLine()
    }
},]
var map, car, location, geocoder
let theme = ref('normal') //当前map主题
let themeStyle = ref('#ffffff') //当前map主题

let center = ref([]) //当前地理位置
const defaultMarker = [] //markerOptions[0].value //默认覆盖物值
let markerValue = ref(defaultMarker) //下拉框覆盖物绑定值
let markerValues = ref(markerOptions.filter(p => p.value == defaultMarker[0])) //默认覆盖物所有值

//表单ref
const formRef = ref(null);
//表单绑定值
let formValue = ref({
    title: "",
    textarea: "",
    video: "",
    date: "",
})
//表单规责
const rules = {
    title: {
        required: true,
        message: "请输入标题",
    },
    textarea: {
        required: true,
        message: "请输入内容",
    },
}
// 模态框title配置
const roles = [{
    label: '添加',
    key: 'add',
    value: 1,
}, {
    label: '编辑',
    key: 'edit',
    value: 2,
}, {
    label: '查看',
    key: 'read',
    value: 3,
},]
//模态框状态
const Modal = reactive({
    visible: false,
    state: 'add',
});
//模态框title
const title = computed(() => {
    return roles.filter(p => p.key == Modal.state)[0]?.label + '点标记'
})
const Autopilot = ref(false); //自动驾驶
const follow = ref(false); //跟随镜头

const showDropdown = ref(false); //右键菜单
const x = ref(0); //右键菜单-x
const y = ref(0); //右键菜单-y
//初始点标记
var markers = [{
    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png',
    position: [116.205467, 39.907761]
}, {
    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-2.png',
    position: [116.368904, 39.913423]
}, {
    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-3.png',
    position: [116.305467, 39.807761]
},];
//菜单项
const options = [{
    label: "路线轨迹",
    key: "polyline",
    children: [{
        label: "轨迹回放",
        value: "moveAlong",
        onclick: moveAlong,
    }, {
        label: "清除所有路线",
        value: "clearAllAlong",
        onclick: () => {
            clearMap(state.polylineList)
            state.path = []
            state.polylineList = []
        },
    },]
}, {
    label: "标记覆盖物",
    key: "marker",
    children: [{
        label: "清除新增标记",
        value: "clearMap",
        onclick: () => {
            clearMap(state.markerList)
            state.markerList = []
        },
    }, {
        label: "清除所有标记",
        value: "clearAllMap",
        onclick: clearMap,
    },]
}, {
    label: "主题样式",
    key: "theme",
    children: [{
        label: "标准",
        value: "normal",
    }, {
        label: "幻影黑",
        value: "dark",
    },
    {
        label: "月光银",
        value: "light",
    },
    {
        label: "远山黛",
        value: "whitesmoke",
    },
    {
        label: "草色青",
        value: "fresh",
    },
    {
        label: "雅士灰",
        value: "grey",
    },
    {
        label: "涂鸦",
        value: "graffiti",
    },
    {
        label: "马卡龙",
        value: "macaron",
    },
    {
        label: "靛青蓝",
        value: "blue",
    },
    {
        label: "极夜蓝",
        value: "darkblue",
    },
    {
        label: "酱籽",
        value: "wine",
    },]
},]
//进行地图初始化
function initMap() {
    AMapLoader.load({
        key: amapKey, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    }).then((AMap) => {
        createMap(AMap)
    }).catch((e) => {
        console.log(e);
    });
}
onMounted(() => {
    map && destroyMap()
    setTimeout(() => {
        initMap();
    }, 500);
})
//创建map
function createMap(AMap) {
    map = new AMap.Map("gmap", {
        //设置地图容器id
        viewMode: "3D", //是否为3D地图模式
        zoom: 10, //初始化地图级别
    });
    const delMaps = ['amap-logo', 'amap-copyright']
    delMaps.map(item => {
        const gmap = document.getElementsByClassName(item)[0]
        gmap.remove()
    })
    map.on("complete", function () {
        const { lng, lat } = map.getCenter()
        center.value = [lng, lat]
        createCar()
        createMarker(markers)
        polyline()
    });
    //添加插件
    AMap.plugin(plugin, function () {
        //异步同时加载多个插件
        /* map.addControl(new AMap.HawkEye()); */ // 显示缩略图
        map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
        map.addControl(new AMap.ControlBar());// 增加3d控制罗盘
        map.addControl(new AMap.MapType());// 类别切换控件
        map.addControl(location = new AMap.Geolocation());// 类别切换控件
        /* geolocation() */
    });
    // 单击
    map.on("click", (e) => {
        const { lng, lat, KL, kT } = e.lnglat
        markerValues.value?.map(item => {
            item?.onclick([lng, lat])
        })
        state.current_position = [lng, lat];
        /* state.current_position = [lng, lat];
        state.path.push([lng, lat]);
        addMarker([lng, lat]);
        addPolyLine(); */
    });
}
//创建当前位置标记
function createCar() {
    car = new AMap.Marker({
        map,
        position: center?.value,
        icon: '/cxk.gif',
        offset: new AMap.Pixel(-13, -30),
    });
    state.path.push(center?.value);//以当前位置为轨迹回放起始点
}
// 初始化添加点标记
function createMarker(markers, position) {
    markers.forEach(function (marker) {
        new AMap.Marker({
            map: map,
            icon: marker.icon,
            position: [marker.position[0], marker.position[1]],
            offset: new AMap.Pixel(-13, -30)
        });
    });
}
// 清除地图上所有添加的覆盖物
function clearMap(params) {
    if (params) {
        map?.remove(params);
    } else {
        car?.stopMove();
        map?.clearMap();
        car = null
        state.markerList = []
        state.path = []
        state.polylineList = []
    }
}
//高精度定位
/* function geolocation() {
    location?.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
            map.setCenter(result.position.pos, true)
        }
    });
} */
//定制地图上覆盖物类型
function setMarkerOptions(_, params) {
    console.log(params);
    markerValues.value = params
}
// 开关模态框
function changeModal(bool, state = 'add') {
    Modal.visible = bool ? bool : !Modal.visible
    Modal.state = state
    formValue = ref({
        title: Random.ctitle(),
        textarea: Random.cparagraph(),
        video: "",
        date: Random.now(),
    })
}
// 实例化-添加点标记
function addMarker(position, data) {
    // 获取当 marker 类型的覆盖物
    /* var overlays = map?.getAllOverlays('marker');
    console.log(overlays); */
    const marker = new AMap.Marker({
        map,
        position,
        icon: Random.dataImage('25x34', state.markerList.length),
        offset: new AMap.Pixel(-13, -30),
        data,
    });
    marker.on('click', markerClick);
    state.markerList.push(marker)
}
//提交表单
function submitCallback() {
    formRef.value?.validate((errors) => {
        if (!errors) {
            try {
                addMarker(state.current_position, formValue.value)
            } finally {
                changeModal(false)
            }
        }
    })
    return false
}
// 点击点标记事件
function markerClick(e) {
    const { data } = e.target._originOpts
    changeModal(true, 'read')
    formValue.value = data
}
// 绘制轨迹
function polyline() {
    var passedPolyline = new AMap.Polyline({
        map,
        strokeColor: "#AF5",  //线颜色
        strokeWeight: 8,      //线宽
    });
    car?.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
        follow.value && map.setCenter(e.target.getPosition(), true)
    });
}
// 点击-添加线路
function addPolyLine() {
    const polyline = new AMap.Polyline({
        path: state.path,
        isOutline: true,
        outlineColor: "#ffeeff",
        borderWeight: 1,
        strokeColor: "#3366FF",
        strokeOpacity: 0.6,
        strokeWeight: 5,
        strokeStyle: "solid",
        lineJoin: "round",
        lineCap: "round",
        zIndex: 50,
        showDir: true,
    });
    state.polylineList.push(polyline)
    map.add(polyline);
    Autopilot.value && moveAlong()
}
//轨迹回放
function moveAlong() {
    if (!car) {
        createCar()
    }
    state.path?.length >= 2 && car?.moveAlong(state.path, {
        // 每一段的时长
        duration: 500,//可根据实际采集时间间隔设置
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
    });
    /* // 地图按照适合展示图层内数据的缩放等级展示
    map?.setFitView(); */
}
//换皮
function setMapStyle(value) {
    var styleName = "amap://styles/" + value;
    map?.setMapStyle(styleName);
}
//右键菜单操作
function handleContextMenu(e) {
    e.preventDefault();
    const { clientX, clientY } = e
    x.value = clientX
    y.value = clientY
    showDropdown.value = true
}
//键菜单外点击右操作
function onClickoutside() {
    showDropdown.value = false;
}
//点击右键菜单项操作
function handleSelect(_, e) {
    console.log(e);
    onClickoutside()
    if (e && e.onclick) {
        e.onclick()
    } else {
        setMapStyle(e.value)
        theme.value = e.value
    }
}
// 监听单个 state
watch(themes, (newX) => {
    const theme = newX.theme ? 'dark' : 'normal'
    themeStyle.value = newX.theme ? '#18181c' : '#ffffff'
    setMapStyle(theme)
})
//销毁
function destroyMap() {
    console.log('销毁');
    clearMap()
    map?.destroy();
    map = null
}
onBeforeUnmount(() => {
    destroyMap()
})
</script>
  
<style scoped lang="less">
#gmap {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;

    :deep(.amap-markers .amap-marker .amap-icon) {
        overflow: inherit;

        img {
            width: 25px;
            height: 34px;
        }
    }
}

.right_box {
    width: 140px;
    padding: 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: absolute;
    top: 16%;
    right: 1.4%;
    background-color: v-bind(themeStyle);
    border-radius: 3px;
    box-shadow: 0 0 4px 1px rgb(0 0 0 / 20%);
}
</style>