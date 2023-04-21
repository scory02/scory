<script setup>
import UnityWebgl from 'unity-webgl';
import config from '~/config.json'
const { unityURL } = window.this.geturlList();
var Unity
let currentUrl = ref(null);
const createUnity = (Url) => {
  Unity = new UnityWebgl({
    loaderUrl: Url + "Script.loader.js",
    dataUrl: Url + "Script.data.gz",
    frameworkUrl: Url + "Script.framework.js.gz",
    codeUrl: Url + "Script.wasm.gz",
    streamingAssetsUrl: Url + "StreamingAssets",
  });
  /* 下载中 */
  Unity.on('progress', (number) => {
    if (number > 0) {
      $loading.start(number)
    }
  })
  /* 创建完成 */
  Unity.on('created', () => {
    $loading.finish()
  })
}
async function onLoad() {
  Unity?.create('#webGL')
}
function onUnload() {
  if (Unity && Unity?.unload) {
    Unity?.unload();
    Unity?.unityInstance?.Quit();
    $loading?.finish()
  }
}
const init = (url, baseURL = unityURL) => {
  onUnload()
  currentUrl.value = url
  url = baseURL + url + '/'
  createUnity(url)
  setTimeout(() => {
    onLoad()
  }, 1000)
}
let options = ref([])
const objToArray = (obj) => {
  return Object.keys(obj).map(key => {
    return {
      label: key + `[${obj[key]}]`,
      value: obj[key]
    }
  })
}
options.value = objToArray(config)
function handleUpdateValue(params) {
  init(currentUrl.value, params)
}
defineExpose({ init });
onBeforeUnmount(() => {
  onUnload()
})
</script>

<template>
  <n-space vertical>
      <n-select v-model:value="value" :options="options" @update:value="handleUpdateValue" />
    </n-space>
    <!-- 页面内容 -->
    <canvas id="webGL" v-loading></canvas>
</template>

<style>
#webGL {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>