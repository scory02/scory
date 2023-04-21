<template>
  <n-tabs type="segment" class="flex-col-stretch h-full" pane-class="flex-1-hidden">
    <n-tab-pane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label" class="h-full relative">
      <n-scrollbar>
        <component :is="item.component" class="h-full w-full" />
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { echarts, timeClock, pie, Dbutton, } from './component';

interface Map {
  id: string;
  label: string;
  component: Component;
}

const maps: Map[] = [
  { id: 'time', label: '时钟', component: timeClock },
  { id: 'echarts', label: 'echarts', component: echarts },
  { id: 'pie', label: '饼图', component: pie },
  { id: 'Dbutton', label: '3d按钮', component: Dbutton },
];
</script>

<style scoped></style>
