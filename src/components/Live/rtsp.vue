<template>
  <div class="hello">
    <div id="playerRef" style="height: 700px"></div>
    <button @click="handlePlay">播放</button>
    <button @click="handlePlayByWnd">指定窗口播放</button>
    <button @click="handleSwitchWnd">切换窗口</button>
    <button @click="handleSnapshot">抓拍</button>
    <button @click="handleClear">清空</button>
  </div>
</template>

<script>
import RtspPlayer, { RtspWindowEnum } from 'rtsp-web-player';
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    let player = null;
    const init = () => {
      player = new RtspPlayer({
        timeOut: 30000,
        theme: {
          primaryColor: '#8528EE',
          backgroundColor: '#18181C',
          borderColor: '#2D2D30',
          fontColor: '#909092'
        },
        wnd: RtspWindowEnum.SIX,
        target: document.querySelector('#playerRef'),
        onWindowActiveEvent: (wndInfo) => {
        },
        onEvents: (event) => {
        }
      });
    };
    const handlePlay = () => {
      player?.play({
        rtspUrl: 'rtsp://:8554/video',
        cameraName: '252'
      });
    };
    const handleSwitchWnd = () => {
      player?.switchWindow(RtspWindowEnum.SIXTEEN);
    };
    const handlePlayByWnd = () => {
      player?.play({
        rtspUrl: 'rtsp://:8554/video',
        cameraName: '252',
        wnd: 1
      });
    };
    const handleClear = () => {
      player?.clearPlayer();
    };
    const handleSnapshot = () => {
      player?.localSnapshot({ wnd: 1, isDownload: false }).then((res) => {
        console.log(
          '🚀 ~ file: HelloWorld.vue ~ line 56 ~ player?.localSnapshot ~ res',
          res
        );
      });
    };
    onMounted(() => {
      init();
    });
    return {
      handlePlay,
      handleSwitchWnd,
      handleClear,
      handlePlayByWnd,
      handleSnapshot
    };
  }
});
</script>