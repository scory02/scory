<script setup>
import Tree from '@/views/modal/Tree/index.vue';
import Unity from '@/views/modal/unity/unity.vue';
import { unityEnum } from '@/enums';
</script>

<template>
  <div class="flex-column h-full">
    <Tree :data="unityEnum" />
    <border2>
      <Unity />
    </border2>
  </div>
</template>

<style>
</style>