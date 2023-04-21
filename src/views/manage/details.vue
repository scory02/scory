<template>
  <div>
    <n-card title="项目信息" hoverable class="rounded-16px shadow-sm">
      <n-descriptions label-placement="top" bordered :column="6">
        <n-descriptions-item label="项目名称">
          {{ name }}
        </n-descriptions-item>
        <n-descriptions-item label="项目版本">
          {{ version }}
        </n-descriptions-item>
        <n-descriptions-item label="项目地址">
          <n-button text tag="a" :href="url" target="_blank" type="primary">
            {{ url }}
          </n-button>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <splitPane @resize="handleResize" :min-percent='20' :default-percent='50' split="vertical" class="splitPane">
      <template #paneL>
        <n-card title="devDependencies" hoverable class="rounded-16px shadow-sm">
          <n-descriptions label-placement="top" bordered :column="6">
            <n-descriptions-item v-for="(value, key, index) in devDependencies" :label="key" :key="'dev' + index">
              {{ value }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </template>
      <template #paneR>
        <n-card title="dependencies" hoverable class="rounded-16px shadow-sm">
          <n-descriptions label-placement="top" bordered :column="6">
            <n-descriptions-item v-for="(value, key, index) in dependencies" :label="key" :key="'dep' + index">
              {{ value }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </template>
    </splitPane>
  </div>
</template>

<script setup>
import { name, version, url, dependencies, devDependencies } from '../../../package.json';
const handleResize = (val) => {
}
</script>

<style scoped></style>
