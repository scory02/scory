<template>
  <n-tree :data="props.data" :default-expanded-keys="currentUnity" :default-selected-keys="[last(currentUnity)]"
    :on-update:selected-keys="getCheckedData" block-line expand-on-click selectable />
</template>

<script setup>
import { useUnity } from '@/store/modules'
const { last, difference } = window.this
const store = useUnity()
const props = defineProps({
  data: Array,
})  //父级传值

const currentUnity = computed(() => difference(store.currentUnity.split('/'), [''])) //当前Unity
//获取父级数据
const getCheckedData = (value, option) => {
  currentUnity.value=value
  if (!option[0]?.top) {
    //props.data 数组 value[0] 当前数据对象 'key' 判断依据
    forChild(props.data, value[0], 'key', [], (data) => {
      const URL = [data.key, option[0].key]
      store.changeUrl('/' + URL.join('/') + '/')
      store.setSendMessage(option[0]?.sendMessage)
    });
  }
}
function forChild(data, value, key, Parent, callback) {
  data?.map((item, index) => {
    if (item[key] == value) {
      callback(Parent)
    }
    if (item?.children) {
      forChild(item?.children, value, key, item, callback)
    }
  })
}
</script>