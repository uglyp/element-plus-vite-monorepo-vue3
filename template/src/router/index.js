import { createRouter, createWebHashHistory } from "vue-router";
import { createRouterGuards } from "./router-guards";

import staticModules from "./staicModules/index";
import asyncModules from "./asyncModules";

export const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/dashboard",
    meta: { title: "Layout" },
    component: () => import("@/layout/BasicLayout.vue"),
    children: [...asyncModules, ...staticModules],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(""),
  routes,
});

export async function setupRouter(app) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;
