<template>
  <scrollTable ref="scrollTable2" :config="config" class="rounded box-border p-4" @mouseover="mouseoverHandler"
    @click="clickHandler" />
</template>
<script setup>
import { watchEffect } from "vue"

const props = defineProps(['data'])
const scrollTable2 = ref(null)
const config = reactive({
  header: ['id', 'image'],
  data: [],
  index: true,
  columnWidth: [50],
  align: ['center'],
})

const mouseoverHandler = (e) => {
  console.log(e)
}

const clickHandler = (e) => {
  console.log(e)
}
const updateRows = async (value) => {
  let data = []
  await value?.map(item => {
    data.push([item.id, item.image])
  })
  config.data=data
  /* scrollTable2.value?.updateRows(data.value) */
}

onMounted(() => {
  watchEffect(() => {
    updateRows(props.data)
  })
})
</script>
