import { createRouter, createWebHistory } from 'vue-router';
import { createRouterGuards } from './routerGuards';
import routes from './routes';

//登录
const login = {
  path: '/login',
  name: '登录',
  component: () => import('../views/login.vue'),
  meta: {
    title: '登录',
  },
}
//需要验证权限
export const asyncRoutes = [];

//普通路由 无需验证权限
export const constantRouter = [login,...routes,];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router;
