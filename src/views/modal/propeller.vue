<template>
  <div class="phone">
    <img id="background" class="img" />
    <n-select class="absolute" placeholder="选择图片" v-model:value="background" :options="options"
      @update:value="changeImg" />
  </div>
</template>
<script setup>
import "Propeller";
import { useMessage } from 'naive-ui'
const message = useMessage()
const options = [
  {
    label: "大风扇",
    value: "/turbine.png"
  },
  {
    label: "阿坤",
    value: "/cxk.gif"
  },
  {
    label: "指尖陀螺3",
    value: "/Gyroscope3.png"
  },
]
let image 
let background = ref(options[0].value)
onMounted(() => {
  run()
})
const index = ref(0);
let propeller
function run() {
  image = document.getElementById('background');
  image.onload = function () {
    propeller = new Propeller(image, {
      inertia: 0.98,
      speed: 20,
      onStop: () => {
        message.success('你干嘛,哎哟！')
      },
      onDragStart: () => {
        index.value++
        message.success('你干嘛,哎哟！' + index.value)
      }
    });
  };
  image.crossOrigin = 'anonymous';
  image.src = '/turbine.png'; //'/cxk.gif';
}
function changeImg(params) {
  propeller.unbind();
  image.src = params;
}
onBeforeUnmount(() => {
  propeller.unbind();
})
</script>

<style lang="less" scoped>
.phone {
  background: cadetblue !important;
  border: 7px solid rgba(47, 53, 66, 0.05);
  border-radius: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img {
  width: inherit;
  height: inherit;
  object-fit: contain;
  position: absolute;
}

.absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
}
</style>
