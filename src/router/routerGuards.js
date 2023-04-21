import { useUserStore } from '@/store/modules/user'
import { useMessage } from 'naive-ui'
const message = useMessage()
export function createRouterGuards(router) {
  const Loading = window['$loadingBar'] || null;
  router.beforeEach((to, from, next) => {
    Loading && Loading.start();
    const { getIslogin, getUserInfo } = useUserStore();
    const { checked } = getUserInfo();
    const islogin = getIslogin();
    if (islogin) {
      if (to.path == '/login') {
        next('/manage');
      }else{
        next();
      }
    } else {
      if (to.path == '/login') {
        next();
      } else {
        next("/login");
        message?.error("未登录")
      }
    }
    /* if (to.path == '/login') {
      next();
    } else {
      if (to.path !== '/' && islogin) {
        next();
      } else if (islogin && checked) {
        next("/manage");
      } else {
        next("/login");
        message?.error("未登录")
      }
    } */
  });

  router.afterEach((to, _, failure) => {
    message?.destroyAll();
    Loading && Loading.finish();
  });

  router.onError((error) => {
    Loading && Loading.error();
  });
}