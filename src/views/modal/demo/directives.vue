<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" title="复制指令">
      <n-space>
        <n-input placeholder="输入内容试试" v-model:value="data" style="width: 350px" />
        <n-button v-copy="data" type="primary">复 制</n-button>
      </n-space>
    </n-card>
    <n-card :bordered="false" title="防抖指令">
      <n-button type="primary" v-debounce="() => messages('防抖测试')">防抖测试</n-button>
    </n-card>
    <n-card :bordered="false" title="节流指令">
      <n-button type="primary" v-throttle="() => messages('节流测试')">节流测试</n-button>
    </n-card>
    <n-card :bordered="false" title="接口测试">
      <n-button type="primary" v-throttle="to">接口测试</n-button>
    </n-card>
    <n-card :bordered="false" title="通知测试">
      <n-button type="primary" v-throttle="showWebNotification">通知测试</n-button>
    </n-card>
    <n-card>
      <template #header>
        <n-skeleton v-if="loading" text width="60%" />
        <template v-else>
          扁平数据结构转Tree
        </template>
      </template>
      <n-skeleton v-if="loading" text :repeat="6" />
      <template v-else>
        <n-code :code="transform" language="javascript" />
      </template>
    </n-card>
  </n-space>
</template>

<script setup>
import { useWebNotification } from '@vueuse/core'
const options = {
  title: 'Hello, scory!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
}
const {
  isSupported,
  show,
} = useWebNotification(options) //通知
let data = ref('')
let loading = ref(true)
let nums = reactive({})
function to() {
  get('/config.json', '', (res) => {
    console.log(res);
  }).then(res => {
    console.log(res);
  })
}
function showWebNotification() {// 获得权限
  Notification.requestPermission(function (res) {
    if (res == 'granted') {
      if (isSupported.value) {
        show()
      }
    } else {
      message.warning('请打开通知权限！')
    }
  });
}
onMounted(() => {
  console.log(window.this.getBrowserInfo());
  console.log(window.this.getNetworkIp());
  window.this.getIPs((res) => console.log(res, 'ip地址'))
  setTimeout(() => {
    loading.value = false
  }, 3000);
})

function messages(msg) {
  if (nums[msg]) {
    nums[msg] += 1
  } else {
    nums[msg] = 1
  }
  message.success(msg + `【${nums[msg]}】`)
}

let arr = ref([
  { id: 1, name: "dependencies", pid: 0, },
  { id: 2, name: "dependencies", pid: 1, },
  { id: 3, name: "dependencies", pid: 1, },
])
const transform = (data) => {
  let chid = {}
  return data.reduce((pre, cur) => {
    const target = { id: cur.id, name: cur.name, pid: cur.pid, children: [] }
    chid[cur.id] = target.children;
    if (cur.pid === 0) {
      pre.push(target)
    } else {
      chid[cur.pid]?.push(target)
    }
    return pre;
  }, [])
}
</script>

<style scoped></style>