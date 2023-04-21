import { createDiscreteApi, darkTheme } from 'naive-ui';
import { computed } from 'vue';
import { useDesignSettingWithOut } from '@/store/modules/designSetting';
import { lighten } from '@/utils/index';
import loading from '@/components/loading';
import splitPane from "vue3-splitpane"; //拖拽滑动分隔面板组件
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { BorderBox1, BorderBox7, BorderBox10, BorderBox11,BorderBox12,BorderBox13,FullScreenContainer,Decoration5,ScrollBoard  } from '@kjgl77/datav-vue3'
/* 自写组件 */
import Card from '@/components/Card/index.vue';

/**
 * 挂载 Naive-ui 脱离上下文的 API
 * 如果你想在 setup 外使用 useDialog、useMessage、useNotification、useLoadingBar，可以通过 createDiscreteApi 来构建对应的 API。
 * https://www.naiveui.com/zh-CN/dark/components/discrete
 */

export function setupNaiveDiscreteApi() {
  const designStore = useDesignSettingWithOut();

  const configProviderPropsRef = computed(() => ({
    theme: designStore.darkTheme ? darkTheme : undefined,
    themeOverrides: {
      common: {
        primaryColor: designStore.appTheme,
        primaryColorHover: lighten(designStore.appTheme, 6),
        primaryColorPressed: lighten(designStore.appTheme, 6),
      },
      LoadingBar: {
        colorLoading: designStore.appTheme,
      },
    },
  }));
  const { message, dialog, notification, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
      configProviderProps: configProviderPropsRef,
    }
  );
  window['$message'] = message;
  window['$dialog'] = dialog;
  window['$notification'] = notification;
  window['$loadingBar'] = loadingBar;
  return { message, dialog, notification, loadingBar }
}

// 常用的 naive-ui 组件
/* const naive = NaiveUI.create({
  components: [
    NaiveUI.NMessageProvider,
    NaiveUI.NDialogProvider,
    NaiveUI.NConfigProvider,
    NaiveUI.NInput,
    NaiveUI.NButton,
    NaiveUI.NForm,
    NaiveUI.NFormItem,
    NaiveUI.NCheckboxGroup,
    NaiveUI.NCheckbox,
    NaiveUI.NIcon,
    NaiveUI.NLayout,
    NaiveUI.NLayoutHeader,
    NaiveUI.NLayoutContent,
    NaiveUI.NLayoutFooter,
    NaiveUI.NLayoutSider,
    NaiveUI.NMenu,
    NaiveUI.NBreadcrumb,
    NaiveUI.NBreadcrumbItem,
    NaiveUI.NDropdown,
    NaiveUI.NSpace,
    NaiveUI.NTooltip,
    NaiveUI.NAvatar,
    NaiveUI.NTabs,
    NaiveUI.NTabPane,
    NaiveUI.NCard,
    NaiveUI.NRow,
    NaiveUI.NCol,
    NaiveUI.NDrawer,
    NaiveUI.NDrawerContent,
    NaiveUI.NDivider,
    NaiveUI.NSwitch,
    NaiveUI.NBadge,
    NaiveUI.NAlert,
    NaiveUI.NElement,
    NaiveUI.NTag,
    NaiveUI.NNotificationProvider,
    NaiveUI.NProgress,
    NaiveUI.NDatePicker,
    NaiveUI.NGrid,
    NaiveUI.NGridItem,
    NaiveUI.NList,
    NaiveUI.NListItem,
    NaiveUI.NThing,
    NaiveUI.NDataTable,
    NaiveUI.NPopover,
    NaiveUI.NPagination,
    NaiveUI.NSelect,
    NaiveUI.NRadioGroup,
    NaiveUI.NRadio,
    NaiveUI.NSteps,
    NaiveUI.NStep,
    NaiveUI.NInputGroup,
    NaiveUI.NResult,
    NaiveUI.NDescriptions,
    NaiveUI.NDescriptionsItem,
    NaiveUI.NTable,
    NaiveUI.NInputNumber,
    NaiveUI.NLoadingBarProvider,
    NaiveUI.NModal,
    NaiveUI.NUpload,
    NaiveUI.NTree,
    NaiveUI.NSpin,
    NaiveUI.NTimePicker,
    NaiveUI.NBackTop,
    NaiveUI.NSkeleton,
  ],
}); */

// 注册全局常用的 naive-ui 组件
export function setupNaive(app) {
  setupNaiveDiscreteApi()
  app.use(loading)/* .use(NaiveUI) */
    .component('fullScreen', FullScreenContainer)
    .component('border1', BorderBox1)
    .component('border2', BorderBox7)
    .component('border3', BorderBox10)
    .component('border4', BorderBox11)
    .component('border5', BorderBox12)
    .component('border6', BorderBox13)
    .component('top1', Decoration5)
    .component('scrollTable', ScrollBoard)
    .component("MyCard", Card) //疯转的Card-查看复制代码
    .component("splitPane", splitPane) //拖拽滑动分隔面板组件
    .component("splitpanes", Splitpanes) //拖拽滑动分隔面板组件
    .component("pane", Pane) //拖拽滑动分隔面板组件
}
