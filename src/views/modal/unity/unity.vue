<script setup>
import { useUnity } from '@/store/modules'
import UnityWebgl from 'unity-webgl';
const { baseURL, unityURL } = window.this.geturlList();
const store = useUnity()
const configURL = computed(() => store.URL)
const currentUnity = computed(() => store.currentUnity)
const sendMessage = computed(() => store.sendMessage)
var Unity = ref({})
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
    console.log(currentUnity.value, '创建完成');
    $loading.finish()
    if (currentUnity.value.includes("home")) {
      changeUrl(configURL.value)
      window['SelectRoom'] = () => {
        watchEffect(() => {
          changeUnity(store.Unity)
        })
      }
    } else {
      watchEffect(() => {
        changeUnity(store.Unity)
      })
    }
  })
}

/* 传地址给unity */
const changeUrl = (Url) => {
  if (Unity) {
    Unity.send("SceneManagement", "SetBundleUrl", Url + "StreamingAssets");
    Unity.send("SceneManagement", "SetBaseUrl", baseURL);
    Unity.send("SceneManagement", "ChangeScene", 'room');
  }
}
/* 改变unity场景 */
const changeUnity = (value) => {
  const msg = sendMessage.value?.split(',')
  if (Unity && msg && msg.length > 0) {
    Unity.send(msg[0], msg[1], value)
    /* if (currentUnity.value.includes("zutai")) {
      Unity.send("ReceiveWeb", "ChangeZT", value);//组态切换到皖南急救中心
    } else if (currentUnity.value.includes("home")) {
      changeUrl(configURL.value)
      setTimeout(() => {
        Unity.send("SceneManagement", "ChangeScene", value);
      }, 12000);
    } */
  }
}
async function onLoad() {
  /* var canvasList = document.getElementById('canvasBorder');
  if ($('#webGL')[0]) {
    await onUnload()
  }
  var canvas = document.createElement('canvas');
  canvas.setAttribute("id", "webGL");
  canvasList.appendChild(canvas); */
  Unity?.create('#webGL')
}
watchEffect(() => {
  onUnload()
  createUnity(configURL.value)
  setTimeout(() => {
    onLoad()
  }, 1000)
})
function onUnload() {
  if (Unity && Unity?.unload) {
    Unity?.unload();
    $loading?.finish()
    console.log('卸载Unity');
  }
}
onBeforeUnmount(() => {
  onUnload()
})
</script>

<template>
  <!-- <div id="canvasBorder" /> -->
  <!-- <UnityVue :unity="Unity" v-fit /> -->
  <canvas id="webGL"></canvas>
</template>

<style>
#webGL {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 4px;
  flex: 1;
}
</style>