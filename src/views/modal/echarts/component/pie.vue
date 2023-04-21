<template>
  <div ref="pieRef" class="echarts transition duration-500 ease-in-out"></div>
</template>

<script setup>
import { useEcharts } from '@/utils/echarts';
const pieRef = ref(null);
const props = defineProps({
  id: String,
})  //父级传值
const pieOptions = ref({
  legend: {},
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 150],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' }
      ]
    }
  ]
});

onMounted(() => {
  useEcharts(pieRef, pieOptions,);
})

</script>