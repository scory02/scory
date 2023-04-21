<template>
  <n-space>
    <n-button type="primary" @click="res.open()">
      打开文件
    </n-button>
    <n-button type="primary" @click="res.create()">
      创建新文件
    </n-button>
    <n-button type="success" :disabled="!res.file.value" @click="onSave">
      保存
    </n-button>
    <n-button type="success" :disabled="!res.file.value" @click="res.saveAs()">
      另存为
    </n-button>
  </n-space>
  <pre>{{ JSON.stringify(str, null, 2) }}</pre>
  <div v-if="content">
    文件内容
    <n-input v-model:value="content" w-full v-if="typeof content === 'string'" 
    :autosize="{
      minRows: 3,
      maxRows: 20
    }" clearable type="textarea"
      placeholder="无数据" />
    <span v-else>{{ content }}</span>
  </div>
</template>

<script setup>
import { useFileSystemAccess } from '@vueuse/core'
const dataType = ref('Text')
const res = useFileSystemAccess({
  dataType,
  types: [{
    description: 'text',
    accept: {
      'text/plain': ['.txt', '.html', '.json'],
    },
  }],
  excludeAcceptAllOption: true,
})
const content = res.data
const str = reactive({
  '支持': res.isSupported?'是':'否',
  '文件': res.file,
  '文件名': res.fileName,
  '文件类型': res.fileMIME,
  '文件大小': res.fileSize,
  '文件上次修改日期': res.fileLastModified,
})
async function onSave() {
  await res.save()
}
</script>

<style scoped></style>