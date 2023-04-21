<template>
    <div ref="gaugeRef" class="h-full shadow-sm"></div>
</template>
  
<script setup>
import { useEcharts } from '@/utils/echarts';
const gaugeRef = ref(null)

const gaugeOptions = ref({
    series: [
        {
            name: 'hour',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 12,
            splitNumber: 12,
            clockwise: true,
            axisLine: {
                lineStyle: {
                    width: 15,
                    color: [[1, 'rgba(117,64,154,0.7)']],
                    shadowColor: 'rgba(117,64,154, 0.5)',
                    shadowBlur: 15
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(117,64,154, 0.5)',
                    shadowColor: 'rgba(117,64,154,0.7)',
                    shadowBlur: 3,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2
                }
            },
            axisLabel: {
                fontSize: 50,
                distance: 25,
                color: 'rgba(117,64,154, 0.5)',
                formatter(value) {
                    if (value === 0) {
                        return '';
                    }
                    return `${value}`;
                }
            },
            pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 12,
                length: '55%',
                offsetCenter: [0, '8%'],
                itemStyle: {
                    color: 'rgba(69, 183, 135)',
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4
                }
            },
            detail: {
                show: false
            },
            title: {
                offsetCenter: [0, '30%']
            },
            data: [
                {
                    value: 0
                }
            ]
        },
        {
            name: 'minute',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 60,
            clockwise: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 8,
                length: '70%',
                offsetCenter: [0, '8%'],
                itemStyle: {
                    color: 'rgba(69, 183, 135)',
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4
                }
            },
            anchor: {
                show: true,
                size: 20,
                showAbove: false,
                itemStyle: {
                    borderWidth: 15,
                    color: 'rgba(69, 183, 135)',
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4
                }
            },
            detail: {
                show: false
            },
            title: {
                offsetCenter: ['0%', '-40%']
            },
            data: [
                {
                    value: 0
                }
            ]
        },
        {
            name: 'second',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 60,
            animationEasingUpdate: 'bounceOut',
            clockwise: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 4,
                length: '85%',
                offsetCenter: [0, '8%'],
                itemStyle: {
                    color: 'rgba(69, 183, 135)',
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4
                }
            },
            anchor: {
                show: true,
                size: 15,
                showAbove: true,
                itemStyle: {
                    color: 'rgba(69, 183, 135)',
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4
                }
            },
            detail: {
                show: false
            },
            title: {
                offsetCenter: ['0%', '-40%']
            },
            data: [
                {
                    value: 0
                }
            ]
        }
    ]
})

let intervalId;
useEcharts(gaugeRef, gaugeOptions, chart => {
    intervalId = setInterval(() => {
        const date = new Date();
        const second = date.getSeconds();
        const minute = date.getMinutes() + second / 60;
        const hour = (date.getHours() % 12) + minute / 60;

        chart.setOption({
            animationDurationUpdate: 300,
            series: [
                {
                    name: 'hour',
                    animation: hour !== 0,
                    data: [{ value: hour }]
                },
                {
                    name: 'minute',
                    animation: minute !== 0,
                    data: [{ value: minute }]
                },
                {
                    animation: second !== 0,
                    name: 'second',
                    data: [{ value: second }]
                }
            ]
        });
    }, 1000);
});

function clearClock() {
    clearInterval(intervalId);
}

onUnmounted(() => {
    clearClock();
});
</script>
  
<style scoped></style>
  