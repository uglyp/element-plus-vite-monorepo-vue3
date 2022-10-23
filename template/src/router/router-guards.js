import { useAppStoreWithOut } from "@/store/modules/app";
import NProgress from "nprogress"; // progress bar
import { domTitle, setDocumentTitle } from "@/utils/domUtil";
import { clearPending } from "~utils/http";

// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { debounce } from '~utils/lodashChunk'

// 白名单、以及公共不缓存的页面
export const allowList = [
  "Redirect",
  "Redirect-view",
  "user",
  "user-login",
  "exception",
  "exception-Exception403",
  "exception-Exception404",
  "exception-Exception500",
  "404",
];

// const loginRoutePath = '/user/login'
export const defaultRoutePath = "/dashboard";

// 创建路由守卫
export function createRouterGuards(router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start(); // start progress bar
    // 清除遗留请求
    clearPending();
    next();
  });

  router.afterEach((to, from, failure) => {
    const AppStore = useAppStoreWithOut();

    // 设置网页标题
    to.meta &&
      typeof to.meta.title !== "undefined" &&
      setDocumentTitle(`${to.meta.title} - ${domTitle}`);
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = AppStore.keepAliveComponents;
    const currentComName = to.matched.find((item) => item.name == to.name)
      ?.components?.default.name;
    if (
      currentComName &&
      !keepAliveComponents.includes(currentComName) &&
      to.meta?.keepAlive
    ) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == "Redirect") {
      // 不需要缓存的组件
      const index = AppStore.keepAliveComponents.findIndex(
        (name) => name == currentComName
      );
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    AppStore.setkeepAliveComponents(keepAliveComponents);
    NProgress.done(); // finish progress bar
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });

  return router;
}
