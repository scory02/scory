/* 按需引入 echarts */
import { nextTick, effectScope, onScopeDispose, ref, watch } from "vue";
import * as echarts from "echarts/core";
import 'echarts/lib/component/dataZoom'
import {
  BarChart,
  GaugeChart,
  LineChart,
  MapChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
} from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
  TimelineComponent,
  PolarComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useElementSize } from "@vueuse/core";
import { useTheme } from "@/store/modules";
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  VisualMapComponent,
  TimelineComponent,
  PolarComponent,
  EffectScatterChart,
  BarChart,
  LineChart,
  MapChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

// 注入 echarts 到全局
export function setupEcharts(app) {
  app.config.globalProperties.$echarts = echarts;
  window["echarts"] = echarts;
}

/**
 * Echarts hooks函数
 * @param domRef - domRef
 * @param options - 图表配置
 * @param renderFun - 图表渲染函数(例如：图表监听函数)
 * @description 按需引入图表组件，没注册的组件需要先引入
 */
export function useEcharts(domRef, options, renderFun) {
  const theme = useTheme();
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart = null; //echarts.ECharts

  function canRender() {
    return initialSize.width > 0 && initialSize.height > 0;
  }

  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  function update(updateOptions) {
    if (updateOptions) {
      if (isRendered()) {
        chart?.clear();
        chart?.setOption({
          ...updateOptions,
          backgroundColor: "transparent",
        });
      }
    }
  }

  async function render() {
    if (domRef.value) {
      const chartTheme = theme.theme ? "dark" : "light";
      await nextTick();
      chart = echarts.init(domRef.value, chartTheme);
      if (renderFun) {
        renderFun(chart, echarts);
      }
      update(isRef(options)?options.value:options);
    }
  }

  function resize() {
    chart?.resize();
  }

  function destroy() {
    chart?.dispose();
  }

  function updateTheme() {
    destroy();
    render();
  }

  const scope = effectScope();

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      initialSize.width = newWidth;
      initialSize.height = newHeight;
      if (newWidth === 0 && newHeight === 0) {
        // 节点被删除 将chart置为空
        chart = null;
      }
      if (canRender()) {
        if (!isRendered()) {
          render();
        } else {
          resize();
        }
      }
    });

    watch(
      options,
      (newValue) => {
        update(newValue);
      },
      { deep: true }
    );

    watch(
      () => theme.theme,
      () => {
        updateTheme();
      }
    );
  });

  onScopeDispose(() => {
    destroy();
    scope.stop();
  });

  return {
    domRef,
  };
}
