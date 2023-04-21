<template>
    <iframe :src="url||'https://c.runoob.com/more/svgeditor/'" 
    class="h-full w-full" scrolling="no" border="0" frameborder="no" framespacing="0" />
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()
const props = defineProps({
  url: String,
})  //父级传值
console.log('[ $route.params ] >', route.params)
</script>