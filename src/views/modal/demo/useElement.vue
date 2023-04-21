<script setup>
import { useElementBounding, useElementByPoint, useEventListener, useMouse } from '@vueuse/core'
import { useEcharts } from '@/utils/echarts';
import { reactive } from 'vue';

const xyRef = ref(null);
const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))
useEventListener('scroll', bounding.update, true)

const boxStyles = computed(() => {
  if (element.value) {
    return {
      display: 'block',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      transition: 'all 0.05s linear',
    }
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))
let data = reactive({
  x: [],
  y: [],
})
const xyOptions = {
  title: {
    text: 'x,y轴折线图'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['x', 'y',]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['x', 'y']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'x轴',
      type: 'line',
      stack: 'Total',
      data: data.x
    },
    {
      name: 'y轴',
      type: 'line',
      stack: 'Total',
      data: data.y
    },
  ]
};
let xyintervalId = null;
useEcharts(xyRef, xyOptions, chart => {
  xyintervalId = setInterval(function () {
    for (var i = 0; data.x.length > 6; i++) {
      data.x.shift();
      data.y.shift();
    }
    data.x.push(x.value)
    data.y.push(y.value)
    chart?.setOption({
      series: [
        {
          data: data.x
        },
        {
          data: data.y
        },
      ]
    });
  },);
})
function clearClock() {
  clearInterval(xyintervalId);
}
onUnmounted(() => {
  clearClock();
});
</script>

<template>
  <div ref="xyRef" class="h-400px"></div>
  <div :style="boxStyles" fixed pointer-events-none z-9999 border="1 $vp-c-brand">
    <n-space justify="center">
      <n-tag :bordered="false" type="info">
        <n-gradient-text type="danger">
          {{parseInt(boxStyles.width) }}
          x
          {{parseInt(boxStyles.height) }}
        </n-gradient-text>
      </n-tag>
    </n-space>
  </div>
  <div :style="pointStyles" fixed top-0 left-0 pointer-events-none w-2 h-2 rounded-full bg-green-400 shadow z-999 />
  <n-space justify="center">
    <n-tag :bordered="false" round type="info">
      x:
    </n-tag>
    <n-tag :bordered="false" type="info">
      {{ x }}
    </n-tag>
    <n-tag :bordered="false" round type="warning">
      y:
    </n-tag>
    <n-tag :bordered="false" type="warning">
      {{ y }}
    </n-tag>
  </n-space>
</template>