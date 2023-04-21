export default [
  {
    path: "/",
    name: "大屏",
    component: () => import("../components/layout/index.vue"),
    children: [
      {
        path: "/",
        name: "大屏",
        component: () => import("../views/screen/index.vue"),
        meta: {
          title: "大屏",
        },
      },
      {
        path: "/ScreenGmap",
        name: "ScreenGmap",
        component: () => import("../views/modal/map/gmap.vue"),
        meta: {
          title: "高德地图",
        },
      },
      {
        path: "/ScreenEmap",
        name: "ScreenEmap",
        component: () => import("../views/screen/emap.vue"),
        meta: {
          title: "echarts地图",
        },
      },
    ],
    meta: {
      title: "大屏",
    },
  },
  {
    path: "/manage",
    name: "管理大屏",
    component: () => import("../views/manage/index.vue"),
    meta: {
      title: "管理大屏",
      auth: "admin",
    },
    children: [
      {
        path: "/manage",
        name: "manage",
        component: () => import("../views/manage/home.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/game",
        name: "game",
        meta: {
          title: "Demo",
        },
        children:[
          /* {
            path: "/risk",
            name: "risk",
            component: () => import("../views/game/risk.vue"),
            meta: {
              title: "冒险游戏",
            },
          }, */
          {
            path: "/propeller",
            name: "propeller",
            component: () => import("../views/modal/propeller.vue"),
            meta: {
              title: "拖拽旋转",
            },
          },
          {
            path: "/move",
            name: "move",
            component: () => import("../views/modal/demo/move.vue"),
            meta: {
              title: "方向键移动",
            },
          },
          {
            path: "/shoot",
            name: "shoot",
            component: () => import("../views/game/shoot.vue"),
            meta: {
              title: "shoot",
            },
          },
          {
            path: "/car",
            name: "car",
            component: () => import("../views/game/car.vue"),
            meta: {
              title: "car",
            },
          },
        ]
      },
      {
        path: "/echarts",
        name: "echarts",
        component: () => import("../views/modal/echarts/index.vue"),
        meta: {
          title: "echarts图表",
        },
      },
      {
        path: "/map",
        name: "map",
        meta: {
          title: "地图",
        },
        children:[
          {
            path: "/map",
            name: "map",
            component: () => import("../views/modal/map/gmap.vue"),
            meta: {
              title: "高德地图",
            },
          },
          {
            path: "/emap",
            name: "emap",
            component: () => import("../views/screen/emap.vue"),
            meta: {
              title: "echarts地图",
            },
          },
        ]
      },
      {
        path: "/unity",
        name: "unity",
        component: () => import("../views/modal/unity/index.vue"),
        meta: {
          title: "unity",
        },
      },
      {
        path: "/video",
        name: "video",
        meta: {
          title: "视频",
        },
        children:[
          {
            path: "/xgvideo",
            name: "xgvideo",
            component: () => import("../views/modal/video/xg.vue"),
            meta: {
              title: "西瓜播放器",
            },
          },
          {
            path: "/copyVideo",
            name: "copyVideo",
            component: () => import("../views/modal/video/copyVideo.vue"),
            meta: {
              title: "共享屏幕",
            },
          },
        ]
      },
      {
        path: "/file",
        name: "file",
        component: () => import("../views/modal/file/fileEdit.vue"),
        meta: {
          title: "文件操作",
        },
      },
      {
        path: "/demo",
        name: "demo",
        component: () => import("../views/modal/demo/directives.vue"),
        meta: {
          title: "功能项",
        },
      },
      {
        path: "/useElement",
        name: "useElement",
        component: () => import("../views/modal/demo/useElement.vue"),
        meta: {
          title: "获取DOM元素",
        },
      },
      {
        path: "/iframe",
        name: "iframe",
        component: () => import("../views/modal/iframe.vue"),
        meta: {
          title: "内嵌iframe",
        },
      },
      {
        path: "/details",
        name: "details",
        component: () => import("../views/manage/details.vue"),
        meta: {
          title: "项目详情",
        },
      },
      {
        path: "/Table",
        name: "Table",
        component: () => import("../components/Table/index.vue"),
        meta: {
          title: "综合表格",
        },
      },
    ],
  },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("../views/modal/404.vue"),
    meta: {
      title: "404",
    },
  },
];
