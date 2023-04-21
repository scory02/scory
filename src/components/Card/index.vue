<template>
  <n-card :title="component.__sourceCodeTitle" :bordered="false" class="rounded-16px shadow-sm">
    <n-space justify="end">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button text>
            <template #icon>
              <n-icon :component="Copy20Regular" />
            </template>
          </n-button>
        </template>
        复制代码
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button text @click="toggle">
            <template #icon>
              <n-icon :component="Code16Regular" />
            </template>
          </n-button>
        </template>
        查看代码
      </n-tooltip>
    </n-space>
    <slot name="default">
      <component :is="component" />
    </slot>
    <div class="demo-code" v-if="codeVisible">
      <pre class="language-html" v-html="render"></pre>
    </div>
  </n-card>
</template>

<script>
import { Copy20Regular, Code16Regular } from "@vicons/fluent";
export default {
  props: {
    component: {
      type: Object
    }
  },
  setup(props) {
    console.log(props);
    const { render, setup, __name,__file } = props.component?.type
    const codeVisible = ref(false)
    const toggle = () => {
      codeVisible.value = !codeVisible.value
    }
    return {
      Copy20Regular, Code16Regular,render,
      codeVisible,
      toggle
    }
  },
}
</script>