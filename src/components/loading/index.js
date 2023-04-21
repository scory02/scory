// loading.js
import { createVNode, render } from "vue";
import LoadingComponent from "./index.vue";
let $data;

export default {
  install: (app) => {
    if (!$data) {
      // LoadingComponent 为自己写的组件
      $data = createVNode(
        LoadingComponent,
        {},
        {
          default: () => createVNode(),
        }
      );
      $data.appContext = app._context; // 这句很关键，关联起了数据
      render($data, document.body);
    }
    $data.component.ctx.show = false;

    let loading = {
      start(txt) {
        $data.component.ctx.start(txt);
      },
      finish() {
        $data.component.ctx.finish();
      },
    };

    if (!window['$loading']) {
      window['$loading'] = loading;
    }

    app.config.globalProperties.$loading = app.$loading;
  },
};
