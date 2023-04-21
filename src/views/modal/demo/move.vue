<template>
  <border5>
    <div ref="boxRef" class="h-full w-full">
      <n-image class="ball" :style="{ transform: `translate(${translateX}px, ${translateY}px)` }" src="/cxk.gif" />
    </div>
  </border5>
</template>

<script setup>
import { onKeyStroke, } from '@vueuse/core'
const translateX = ref(10)
const translateY = ref(10)
const boxRef = ref(null)
const move = (axis, direction, limit) => {
  if (axis.value + direction >= 0) {
    if (axis.value + direction > -limit && axis.value + direction < limit) {
      axis.value += direction
    }
  }
}
onMounted(() => {
  const maxWidth = boxRef.value.clientWidth - 100 // subtract ball width
  const maxHeight = boxRef.value.clientHeight - 100 // subtract ball height
  onKeyStroke(['w', 'W', 'ArrowUp'], () => move(translateY, -10, maxHeight))
  onKeyStroke(['s', 'S', 'ArrowDown'], () => move(translateY, 10, maxHeight))
  onKeyStroke(['a', 'A', 'ArrowLeft'], () => move(translateX, -10, maxWidth))
  onKeyStroke(['d', 'D', 'ArrowRight'], () => move(translateX, 10, maxWidth))
})
</script>

<style scoped>
.ball {
  width: 100px;
  height: 100px;
  background: #a1a1a1;
  border-radius: 50%;
}
</style>
