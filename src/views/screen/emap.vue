<template>
  <div>
    <div id="emap" ref="emapRef"></div>
    <div class="back animate-bounce" @click="back">返 回</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useEcharts } from '@/utils/echarts';
const router = useRouter();
const emapRef = ref(null)
const { proxy, ctx } = getCurrentInstance()
const amapKey = 'ade7faec217f922d983a664150ba0fe1';
// 基于准备好的dom，初始化echarts实例
var myChart, myEcharts;

var geoJson = {}

var parentInfo = [{
  cityName: '全国',
  code: 100000
}]

var currentIndex = 0

var timeTitle = ['2015', '2016', '2017', '2018', '2019']
function init(adcode) {
  getGeoJson(adcode).then(data => {
    geoJson = data
    getMapData()
  })
}
function initMap() {
  AMapLoader.load({
    key: amapKey,
    AMapUI: {
      version: '1.1',
      plugins: ['overlay/SimpleMarker']
    },        // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",
  }).then((AMap) => {
    init(100000)
  })
}
onMounted(() => {
  initMap()
})

//这里我封装了下，直接可以拿过来用
function getGeoJson(adcode, childAdcode = '') {
  return new Promise((resolve, reject) => {
    function insideFun(adcode, childAdcode) {
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
          if (error) {
            reject(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length === 0) {
            let parent = areaNode._data.geoData.parent.properties.acroutes;
            insideFun(parent[parent.length - 1], adcode);
            return;
          }

          if (childAdcode) {
            Json = Json.filter(item => {
              return item.properties.adcode == childAdcode;
            });
          }
          let mapJson = {
            features: Json
          };
          resolve(mapJson);
        });
      });

    }
    insideFun(adcode, childAdcode);
  });
}

//获取数据    
function getMapData() {
  let mapData = [],
    pointData = [],
    sum = 0

  geoJson.features.forEach(item => {
    let value = Math.random() * 3000
    mapData.push({
      name: item.properties.name,
      value: value,
      cityCode: item.properties.adcode
    })
    pointData.push({
      name: item.properties.name,
      value: [item.properties.center[0], item.properties.center[1], value],
      cityCode: item.properties.adcode
    })
    sum += value
  })
  mapData = mapData.sort(function (a, b) {
    return b.value - a.value
  });
  initEchartMap(mapData, sum, pointData)
}


//渲染echarts
function initEchartMap(mapData, sum, pointData) {
  var xData = [], yData = []
  var min = mapData[mapData.length - 1].value
  var max = mapData[0].value
  if (mapData.length === 1) {
    min = 0
  }
  mapData.forEach(c => {
    xData.unshift(c.name)
    yData.unshift(c.value)
  })
  var option = {
    timeline: {
      data: timeTitle,
      axisType: 'category',
      autoPlay: true,
      playInterval: 5000,
      left: '10%',
      right: '10%',
      bottom: '2%',
      width: '80%',
      label: {
        normal: {
          textStyle: {
            color: 'rgb(179, 239, 255)'
          }
        },
        emphasis: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      currentIndex: currentIndex,
      symbolSize: 10,
      lineStyle: {
        color: '#8df4f4'
      },
      checkpointStyle: {
        borderColor: '#8df4f4',
        color: '#53D9FF',
        borderWidth: 2,
      },
      controlStyle: {
        showNextBtn: true,
        showPrevBtn: true,
        normal: {
          color: '#53D9FF',
          borderColor: '#53D9FF'
        },
        emphasis: {
          color: 'rgb(58,115,192)',
          borderColor: 'rgb(58,115,192)'
        }
      },
    },
    baseOption: {
      backgroundColor: '#012248',
      title: [{
        left: 'center',
        top: 10,
        text: parentInfo[parentInfo.length - 1].cityName + '销售额统计图(可点击下钻到县)',
        textStyle: {
          color: 'rgb(179, 239, 255)',
          fontSize: 16
        },
      },
      {
        text: "销售总额：" + sum.toFixed(2) + '万',
        left: 'center',
        top: '6.5%',
        textStyle: {
          color: '#FFAC50',
          fontSize: 26
        }
      }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      grid: {
        right: '2%',
        top: '12%',
        bottom: '8%',
        width: '20%'
      },
      toolbox: {
        feature: {
          restore: {
            show: false
          },
          dataView: {
            show: false
          },
          saveAsImage: {
            name: parentInfo[parentInfo.length - 1].cityName + '销售额统计图'
          },
          dataZoom: {
            show: false
          },
          magicType: {
            show: false
          }
        },
        iconStyle: {
          normal: {
            borderColor: '#1990DA'
          }
        },
        top: 15,
        right: 35
      },
      geo: {
        map: parentInfo.length === 1 ? 'china' : 'map',
        zoom: 1.1,
        roam: false,
        left: '10%',
        top: '15%',
        tooltip: {
          trigger: 'item',
          formatter: (p) => {
            let val = p.value[2];
            if (window.isNaN(val)) {
              val = 0;
            }
            let txtCon =
              "<div style='text-align:left'>" + p.name + ":<br />销售额：" + val.toFixed(2) + '万</div>';
            return txtCon;
          }
        },
        label: {
          normal: {
            show: true,
            color: "rgb(249, 249, 249)", //省份标签字体颜色
            formatter: p => {
              switch (p.name) {
                case '内蒙古自治区':
                  p.name = "内蒙古"
                  break;
                case '西藏自治区':
                  p.name = "西藏"
                  break;
                case '新疆维吾尔自治区':
                  p.name = "新疆"
                  break;
                case '宁夏回族自治区':
                  p.name = "宁夏"
                  break;
                case '广西壮族自治区':
                  p.name = "广西"
                  break;
                case '香港特别行政区':
                  p.name = "香港"
                  break;
                case '澳门特别行政区':
                  p.name = "澳门"
                  break;

              }
              return p.name;
            }
          },
          emphasis: {
            show: true,
            color: '#f75a00',
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#24CFF4',
            borderColor: '#53D9FF',
            borderWidth: 1.3,
            shadowBlur: 15,
            shadowColor: 'rgb(58,115,192)',
            shadowOffsetX: 7,
            shadowOffsetY: 6,
          },
          emphasis: {
            areaColor: '#8dd7fc',
            borderWidth: 1.6,
            shadowBlur: 25,
          }

        },
      },
      visualMap: {
        min: min,
        max: max,
        left: '3%',
        bottom: '5%',
        calculable: true,
        seriesIndex: [0],
        inRange: {
          color: ['#24CFF4', '#2E98CA', '#1E62AC']
        },
        textStyle: {
          color: '#24CFF4'
        }
      },
      xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: false,
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#455B77'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 2,
          textStyle: {
            color: '#c0e6f9'
          }
        },
      },
      yAxis: {
        type: 'category',
        nameGap: 16,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#455B77'
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#c0e6f9'
          }
        },
        data: xData
      },
      series: [{
        name: timeTitle[currentIndex] + '年销售额度',
        type: 'map',
        geoIndex: 0,
        map: parentInfo.length === 1 ? 'china' : 'map',
        roam: true,
        zoom: 1.3,
        tooltip: {
          trigger: "item",
          formatter: p => {
            let val = p.value;
            if (p.name == '南海诸岛') return
            if (window.isNaN(val)) {
              val = 0;
            }
            let txtCon =
              "<div style='text-align:left'>" + p.name + ":<br />销售额：" + val.toFixed(2) + '万</div>';
            return txtCon;
          }
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          }
        },
        data: mapData,
      }, {
        name: '散点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        rippleEffect: {
          brushType: 'fill'
        },
        itemStyle: {
          normal: {
            color: '#F4E925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: pointData,

        symbolSize: function (val) {
          let value = val[2]
          if (value == max) {
            return 27
          }
          return 10
        },
        showEffectOn: 'render', //加载完毕显示特效
      }, {
        type: 'bar',
        barGap: '-100%',
        barCategoryGap: '60%',
        itemStyle: {
          normal: {
            color: '#11AAFE'
          },
          emphasis: {
            show: false
          }
        },
        data: yData
      }]
    },
  }
  if (myChart) {
    myEcharts.registerMap(parentInfo.length === 1 ? 'china' : 'map', geoJson);
    myChart.setOption(option)
  } else {
    useEcharts(emapRef, option, (chart, echarts) => {
      myChart = chart;
      myEcharts = echarts;
      //这里做个切换，全国的时候才显示南海诸岛  只有当注册的名字为china的时候才会显示南海诸岛
      echarts.registerMap(parentInfo.length === 1 ? 'china' : 'map', geoJson);
      //点击前解绑，防止点击事件触发多次
      chart.on('click', echartsMapClick);

      //监听时间切换事件
      chart.on('timelinechanged', params => {
        currentIndex = params.currentIndex;
        getMapData();
      });
      setTimeout(() => {
        chart.setOption(option)
      }, 1000);
    })
  }
  /* myChart = proxy.$echarts.init(emapRef.value);
  window['this']['resize'](myChart)
   proxy.$echarts.registerMap(parentInfo.length === 1 ? 'china' : 'map', geoJson);
  myChart.setOption(option, true) */
}

//echarts点击事件
function echartsMapClick(params) {
  if (!params.data) {
    return
  } else {
    //如果当前是最后一级，那就直接return
    if (parentInfo[parentInfo.length - 1].code == params.data.cityCode) {
      return
    }
    let data = params.data
    parentInfo.push({
      cityName: data.name,
      code: data.cityCode
    })
    init(data.cityCode)
  }
}
function back() {
  if (parentInfo.length === 1) {
    router.replace('/manage');
    return;
  }
  parentInfo.pop()
  init(parentInfo[parentInfo.length - 1].code)
}
</script>

<style scoped>
#emap {
  width: 100%;
  height: 100%;
}

.back {
  position: absolute;
  left: 25px;
  top: 25px;
  color: rgb(179, 239, 255);
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
}
.back:hover{
  color: rgb(28, 165, 202);
  font-size: 17px;
}
</style>