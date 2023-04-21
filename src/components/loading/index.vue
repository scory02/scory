<template>
  <div class="box" v-if='show'>
    <div class="load">
      <!-- <dv-decoration-9>
        <div color-green font-600 class="load_txt" bg="~ dark/0">
          {{ text||'加载中' }}
        </div>
      </dv-decoration-9> -->
      <loadingSvg :text="text || '加载中'" />
    </div>
  </div>
</template>


<script>
import loadingSvg from "./loadingSvg.vue";
export default {
  name: "loading",
  components: {
    loadingSvg
  },
  setup() {
    const show = ref(false);
    const text = ref('加载中');

    const start = (txt) => {
      if (!show.value) {
        show.value = true;
      }
      if (Number(txt)) {
        text.value = Number.parseInt((txt * 100).toFixed(2)) + '%';
      } else {
        text.value = txt;
      }
      // 指定时间后移除消息
      if (show.value && !Number(txt)) {
        setTimeout(() => {
          finish();
        }, 10 * 1000);
      }
    };


    const finish = () => {
      show.value = false;
      text.value = '加载中';
    };

    return {
      show,
      start,
      finish,
      text,
    };
  },
};
</script>

<style scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
}

.load {
  width: 180px;
  height: 180px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -90px;
  transform: translate(-50%);
}

.load img {
  width: 100%;
}

.load_txt {
  text-align: center;
  font-size: 20px;
  text-shadow: 0 0 3px #7acaec;
}
</style>
