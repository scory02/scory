<template>
  <unity ref="unityRef" />
</template>

<script setup>
import unity from './index.vue'
const unityRef = ref()
onMounted(() => {
  unityRef.value?.init('/game/shoot')
})
</script>