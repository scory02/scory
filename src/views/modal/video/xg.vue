<template>
    <div ref="domRef"></div>
</template>
  
<script setup>
import {ref} from 'vue';
/* import Player from 'xgplayer'; */
import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';
import HlsJsPlayer from 'xgplayer-hls.js';
const props = defineProps({
  url: String,
})  //父级传值

//表单ref
const domRef = ref(null);
const player = ref(null);

function renderXgPlayer(url) {
    if (!domRef.value) return;
    const poster = "/cxk.gif";
    player.value = new Player({
        el: domRef.value,
        url,
        controlPlugins: [
            volume,
            playbackRate
        ],
        videoInit: true,//没有设置poster的情况下显示视频首帧
        poster,
        playbackRate: [0.5, 0.75, 1, 1.5, 2],//倍速播放
        cssFullscreen: true
    });
}
function destroyXgPlayer() {
    player.value?.destroy();
}

onMounted(() => {
    const url = props.url || 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4'
    renderXgPlayer(url);
});

onUnmounted(() => {
    destroyXgPlayer();
});
</script>
  
<style scoped>
.xgplayer-skin-default {
    width: 100% !important;
    height: 100% !important;
}
</style>
  