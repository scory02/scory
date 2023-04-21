<template>
  <vr class="flex flex-col">
    <template v-slot="defaultData">
      <div class="flex-grow-0 h-10 z-30 flex justify-center">
        <div class="flex-shrink w-6/12">
          <div class="relative h-32 flex justify-center">
            <n-gradient-text size="-webkit-xxx-large" gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">
              Scory
            </n-gradient-text>
            <top1 :dur="2" class="absolute inset-x-0 top-0" />
          </div>
        </div>
        <div class="absolute w-full flex justify-end">
          <n-dropdown trigger="hover" :options="userInfOptions" @select="userInfoSelect">
            <n-avatar round size="medium" src="/scory.svg"  style="z-index: 999999999999;"
              class="cursor-pointer transition duration-300 ease-in-out right-2" />
          </n-dropdown>
        </div>
      </div>
      <div class="flex flex-grow" v-if="!isMobile" v-show="defaultData.show">
        <div class="flex-grow w-2/12 z-30">
          <div class="flex flex-col h-full space-y-6">
            <border1 class="flex-grow">
              <scrollTable />
            </border1>
            <border1 class="flex-grow">
              <div ref="lineRef" class="h-full p-4"></div>
            </border1>
            <border1 class="flex-grow">
              <div ref="barRef" class="h-full p-4"></div>
            </border1>
          </div>
        </div>
        <div class="flex-shrink w-6/12 z-30 self-end">
          <!-- <div class="relative h-32">
                      <top1 :dur="2" class="absolute inset-x-0 top-0" />
                  </div> -->
          <div id="container">
            <div class="cube front"></div>
            <div class="cube back"></div>
            <div class="cube left"></div>
            <div class="cube right"></div>
            <div class="cube top"></div>
            <div class="cube bottom"></div>
          </div>
        </div>
        <div class="flex-grow w-2/12 z-30">
          <div class="flex flex-col space-y-6 h-full">
            <border1 title="时钟" class="flex-grow">
              <timeClock class="box-border" />
            </border1>
            <border1 title="滚动表格" class="flex-grow">
              <scrollTable :data="defaultData.markerList" />
            </border1>
          </div>
        </div>
      </div>
    </template>
  </vr>
</template>

<script setup>
import { NIcon, NAvatar, NText, } from "naive-ui";
import router from '@/router';
import { ArchiveSettings16Filled, ArrowForwardDownPerson20Filled, } from '@vicons/fluent'
import { useEcharts } from '@/utils/echarts';
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
const isMobile = computed(() => width.value <= 1000)
const vr = defineAsyncComponent(() =>
  import('@/views/modal/vr.vue')
)
const timeClock = defineAsyncComponent(() =>
  import('@/views/modal/echarts/component/timeClock.vue')
)
const scrollTable = defineAsyncComponent(() =>
  import('@/views/modal/datav/scrollTable.vue')
)
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};
const logout = () => {
  localStorage?.clear();
  sessionStorage?.clear();
  router?.replace("/login");
};
const lineRef = ref(null)
const barRef = ref(null)
function renderCustomHeader() {
  return h(
    "div",
    {
      style: "display: flex; align-items: center; padding: 8px 12px;"
    },
    [
      h(NAvatar, {
        round: true,
        style: "margin-right: 12px;",
        src: "/scory.svg"
      }),
      h("div", null, [
        h("div", null, [h(NText, { depth: 2 }, { default: () => "scory" })]),
        h("div", { style: "font-size: 12px;" }, [
          h(
            NText,
            { depth: 3 },
            { default: () => "个人技术博客" }
          )
        ])
      ])
    ]
  );
}
const userInfOptions = [
  {
    key: "header",
    type: "render",
    render: renderCustomHeader
  },
  {
    label: "后台管理系统",
    key: "manage",
    icon: renderIcon(ArchiveSettings16Filled),
    onclick: () => router.push('/manage')
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(ArrowForwardDownPerson20Filled),
    onclick: logout
  }
]
const userInfoSelect = (key, e) => {
  e?.onclick()
  message?.info(String(key), e);
}
const lineOptions = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  title: {
    text: 'Stacked Line'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#37a2da',
      name: 'Email',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#37a2da'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      color: '#9fe6b8',
      name: 'Union Ads',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#9fe6b8'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      color: '#fedb5c',
      name: 'Video Ads',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#fedb5c'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      color: '#fb7293',
      name: 'Direct',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#fb7293'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      color: '#e7bcf3',
      name: 'Search Engine',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#e7bcf3'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
});
useEcharts(lineRef, lineOptions);

const barOptions = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      color: '#8378ea',
      showBackground: true,
      barGap: 100,
      itemStyle: {
        borderRadius: [40, 40, 0, 0]
      },
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
});
useEcharts(barRef, barOptions);
</script>

<style type="text/css" scoped >
#container {
  margin: 50px auto;
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-30deg) rotateY(30deg);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotateX(-30deg) rotateY(30deg);
  }

  to {
    transform: rotateX(-30deg) rotateY(390deg);
  }
}

.cube {
  width: 100px;
  height: 100px;
  position: absolute;
  transform-style: preserve-3d;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  box-shadow: 0 0 10px #ccc;
}

.front {
  transform: translateZ(50px);
}

.back {
  transform: rotateY(180deg) translateZ(50px);
}

.left {
  transform: rotateY(-90deg) translateZ(50px);
}

.right {
  transform: rotateY(90deg) translateZ(50px);
}

.top {
  transform: rotateX(90deg) translateZ(50px);
}

.bottom {
  transform: rotateX(-90deg) translateZ(50px);
}

#container:hover {
  animation-play-state: paused;
}</style>