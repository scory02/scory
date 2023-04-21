<script setup>
import { darkTheme, NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { useFps, useIdle, useTimestamp, useWebNotification } from '@vueuse/core'
import AppProvider from './components/Application/index.vue'
import { useTheme } from '@/store/modules'
const theme = useTheme()
onMounted(() => {
  if (location.protocol !== 'https:') {
    let markAsRead = false;
    const path = 'https://' + location.host + location.pathname;
    const n = window['$notification'].create({
      title: "请使用https安全响应头",
      content: `页面存在部分功能不能使用，是否跳转到https？`,
      meta: '目标地址:' + path,
      duration: 1e4,
      action: () => h(
        NButton,
        {
          text: true,
          type: "primary",
          onClick: () => {
            markAsRead = true;
            n.destroy();
            location.href = path;
          }
        },
        {
          default: () => "跳转"
        }
      ),
      onClose: () => {
        if (!markAsRead) {
          markAsRead = true;
          n.destroy();
          /* return false; */
        }
      }
    });
  }
})

const fps = useFps() //fps帧数
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="theme.theme ? darkTheme : null"
    class="layout h-full w-full" preflight-style-disabled>
    <AppProvider>
      <RouterView />
    </AppProvider>
    <div class="fps" v-draggable>FPS:{{ fps }}</div>
  </n-config-provider>
</template>

<style lang="less">
.n-card {
  display: block !important;

  .n-card-header {
    height: 10%;
  }

  .n-card__content {
    height: 90%;
  }
}

.fps {
  position: absolute;
  top: 0;
  width: 60px;
  height: 30px;
  display: flex;
  background-color: #bdbdbd42;
  justify-content: center;
  align-items: center;
  z-index: 9;
}</style>