<template>
    <RouterView />
    <!-- <fullScreen :style="`height:${height}px;width:${width}px`">
    </fullScreen> -->
</template>

<script setup>
import { useMessage } from 'naive-ui'
window['message'] = useMessage()
/* window['$loading'].start() */

var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;//宽度
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//高度
console.log(width, height);

</script>