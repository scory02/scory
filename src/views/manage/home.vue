<template>
  <splitpanes class="default-theme" horizontal>
    <pane min-size="20" size="55">
      <splitpanes class="default-theme" vertical>
        <pane>
          <n-card title="FPS帧数" :bordered="false">
            <div ref="gaugeRef" class="h-400px"></div>
          </n-card>
        </pane>
        <pane>
          <n-card title="二维码" :bordered="false">
            <template #header-extra>
              <n-input v-model:value="text" />
            </template>
            <img v-if="text" class="h-400px object-contain" :src="qrcode" alt="QR Code">
          </n-card>
        </pane>
      </splitpanes>
    </pane>
    <pane size="45">
      <n-card title="动态折线图" :bordered="false">
        <div ref="memoryRef" class="h-400px"></div>
      </n-card>
    </pane>
  </splitpanes>
</template>

<script setup>
import { Copy20Regular, Code16Regular } from "@vicons/fluent";
import { useEcharts } from '@/utils/echarts';
import { useFps, } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
const text = ref('https://scory.top')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 3,
})
const isLoading = ref(true)
const fps = useFps() //fps帧数
const gaugeRef = ref(null)
const memoryRef = ref(null)

const gaugeOptions = {
  series: [
    {
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 50,
          name: 'FPS'
        }
      ]
    }
  ]
};
let gintervalId, MintervalId;
useEcharts(gaugeRef, gaugeOptions, chart => {
  nextTick(() => {
    gintervalId = setInterval(() => {
      chart.setOption({
        series: [
          {
            data: [{
              value: fps.value,
              name: 'FPS'
            }]
          },
        ]
      });
    }, 500);
  })
});

function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value)
    ]
  };
}
let data = [];
let now = new Date(1997, 9, 3);
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
  data.push(randomData());
}
const memoryOptions = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0];
      var date = new Date(params.name);
      return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' : ' +
        params.value[1]
      );
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      data: data
    }
  ]
};
useEcharts(memoryRef, memoryOptions, chart => {
  MintervalId = setInterval(function () {
    for (var i = 0; i < 5; i++) {
      data.shift();
      data.push(randomData());
    }
    chart.setOption({
      series: [
        {
          data: data
        }
      ]
    });
  }, 1000);
})

function clearClock() {
  clearInterval(gintervalId);
  clearInterval(MintervalId);
}
onUnmounted(() => {
  clearClock();
});
</script>

<style scoped></style>
