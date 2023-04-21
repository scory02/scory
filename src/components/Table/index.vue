<template>
  <!-- 查询表单 -->
  <n-form :model="searchValue" label-placement="left" label-width="80">
    <n-grid :cols="cols" :x-gap="cols" :collapsed="gridCollapsed" :collapsed-rows="gridCollapsedRows">
      <n-form-item-gi :span="1" v-for="(item, index) in searchList" :key="index" :label="item.title" :path="item.key">
        <component :is="getComponent(item.type)" v-model:value="searchValue[item.key]" v-bind="item?.bind"
          :placeholder="getPlaceholder(item.type, item.title)" class="w-full" />
      </n-form-item-gi>
      <n-form-item-gi suffix>
        <n-space justify="end" class="w-full">
          <NButton type="primary" @click="addForm">新增</NButton>
          <NButton type="primary" @click="searchForm">搜索</NButton>
          <NButton @click="resetSearch">重置</NButton>
          <n-button icon-placement="right" quaternary @click="handleCollapse">
            <template #icon>
              <n-icon :component="gridCollapsed ? ChevronDown20Regular : ChevronUp16Regular" />
            </template>
            {{ gridCollapsed ? '展开' : '收起' }}
          </n-button>
        </n-space>
      </n-form-item-gi>
    </n-grid>
  </n-form>
  <!-- 数据表格 -->
  <n-data-table :columns="columns.concat(options)" :data="data" :pagination="pagination" :max-height="500"
    :min-height="500" striped />
  <!-- 弹窗详情 -->
  <n-modal v-model:show="Modal.visible" :on-after-leave="() => changeModal(false)" preset="dialog" :title="title">
    <n-form v-if="Modal.state !== 'read'" ref="formRef" :label-width="80" :model="formValue">
      <n-space vertical>
        <n-form-item v-for="(item, index) in columns.filter(p => p.key !== 'actions')" :key="index" :label="item.title"
          :path="item.key" :rule="{
            required: item?.required || false,
            message: getPlaceholder(item.type, item.title),
          }">
          <component :is="getComponent(item.type)" v-model:value="formValue[item.key]" v-bind="item?.bind"
            :placeholder="getPlaceholder(item.type, item.title)" class="w-full" />
        </n-form-item>
      </n-space>
    </n-form>
    <template v-else>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item v-for="(item, index) in columns.filter(p => p.key !== 'actions')" :key="index"
          :label="item.title">
          {{ item.type == 'date' ? toDateTime(formValue[item.key]) : formValue[item.key] }}
        </n-descriptions-item>
      </n-descriptions>
    </template>
    <template #action v-if="Modal.state !== 'read'">
      <n-button type="success" size="small" @click="submitCallback">
        确认
      </n-button>
    </template>
  </n-modal>
</template>


<script setup>
import { NInput, NInputNumber, NDatePicker, NRadio, NCheckbox, NSelect, } from 'naive-ui';
import { ChevronUp16Regular, ChevronDown20Regular } from "@vicons/fluent";
import { cloneDeep, isBoolean, isString } from "lodash-es";
import { toDateTime } from "@/utils/date";
import Mock from "mockjs";
const Random = Mock.Random;
const cols = ref(3) //显示的栅格数量
const gridCollapsed = ref(true) //是否默认折叠
const gridCollapsedRows = ref(1) //默认展示的行数

// 模态框title配置
const roles = [{
  label: '新增',
  key: 'add',
  value: 1,
}, {
  label: '编辑',
  key: 'edit',
  value: 2,
}, {
  label: '查看',
  key: 'read',
  value: 3,
},]
//模态框状态
const Modal = reactive({
  visible: false,
  state: 'add',
});
//模态框title
const title = computed(() => {
  return roles.filter(p => p.key == Modal.state)[0]?.label
})
const search = true; //搜索
const required = true; //必填
/* 表格操作 */
const options = [{
  title: "操作",
  key: "actions",
  width: 200,
  fixed: "right",
  render(row) {
    return h(
      NSpace,
      [h(
        NButton,
        {
          size: "small",
          onClick: () => changeModal(true, 'read', row)
        },
        { default: () => "查看" }
      ), h(
        NButton,
        {
          size: "small",
          onClick: () => changeModal(true, 'edit', row)
        },
        { default: () => "编辑" }
      ),]
    )
  }
}];
/* 表格头部 */
const columns = [
  {
    title: "姓名",
    key: "name",
    search,
    required,
  },
  {
    title: "年龄",
    key: "age",
    type: "number",
    sorter: (row1, row2) => row1.age - row2.age,
    search,
  },
  {
    title: "地址",
    key: "address",
    type: "text",
    search,
  },
  {
    title: "出生日期",
    key: "birthday",
    type: "date",
    bind: {
      type: "datetime",
    },
    render(h) {
      return toDateTime(h?.birthday)
    },
    search,
  },
];

/* 查询表单 */
const searchList = computed(() => {
  return columns.filter(p => p.search)
})
const searchValue = ref({})
/* form表单 */
const formValue = ref({})

/* arr(columns, 'search') */
/* function arr(list, str) {
  let data = [];
  if (str && isString(str)) {
    list.map((item, index) => {
      if (isBoolean(item[str]) && item[str]) {
        data.push(item)
        searchValue[item.key] = null;
      }
    })
  }
  return data
} */
const data = Array.from({ length: 46 }).map((_, index) => ({
  key: index,
  name: Random.cname(),
  age: Random.natural(0, 100),
  birthday: Date.parse(Random.datetime()),
  address: Random.county(true)
}))
const pagination = {
  pageSize: 15
}
// 开关模态框
function changeModal(bool, state = 'add', data) {
  Modal.visible = isBoolean(bool) ? bool : !Modal.visible
  Modal.state = state
  if (bool && data) {
    formValue.value = cloneDeep(data);
  } else if (!bool) {
    resetForm()
  }
}
/* 动态组件 */
const getComponent = (type) => {
  switch (type) {
    case 'number':
      return NInputNumber;
    case 'date':
      return NDatePicker;//必须是时间戳格式
    case 'select':
      return NSelect;
    case 'radio':
      return NRadio;
    case 'checkbox':
      return NCheckbox;
    case 'text':
      return NInput;
    default:
      return NInput;
  }
};
/* 动态提示 */
const getPlaceholder = (type, title) => {
  const input = `请输入${title}`
  const check = `请选择${title}`
  switch (type) {
    case 'date':
      return check;
    case 'select':
      return check;
    case 'radio':
      return check;
    case 'checkbox':
      return check;
    case 'number':
      return input;
    default:
      return input;
  }
};
//表单ref
const formRef = ref(null);
/* 表单保存 */
function submitCallback() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      try {
        message.success('保存成功' + JSON.stringify(formValue.value));
      } finally {
        changeModal(false)
      }
    }
  })
  return false
}
/* 展开/收起 */
const handleCollapse = () => {
  gridCollapsed.value = !gridCollapsed.value
}
/* 打开新增表单 */
function addForm() {
  changeModal(true, 'add')
}
/* 搜索 */
function searchForm() {
  message.success(JSON.stringify(searchValue.value));
}
/* 重置form表单 */
function resetForm() {
  const keys = Object.keys(formValue.value)
  keys.map((key, value) => {
    formValue.value[key] = null;
  })
}
/* 重置搜索表单 */
function resetSearch() {
  const keys = Object.keys(searchValue.value)
  keys.map((key, value) => {
    searchValue.value[key] = null;
  })
}
</script>