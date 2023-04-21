<script setup>
import { useDisplayMedia } from '@vueuse/core'

const video = ref(null)
const { stream, enabled } = useDisplayMedia()

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value
})
</script>

<template>
    <n-card :bordered="false" title="分享屏幕(本地测试，不会联网)">
      <template #header-extra>
        <n-button type="primary" v-debounce="() => enabled = !enabled">
          {{ enabled ? '停止共享' : '开始共享' }}
        </n-button>
      </template>
        <video ref="video" muted autoplay controls class="w-full h-full" />
    </n-card>
</template>