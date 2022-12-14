<template>
  <div class="tabs__view">
    <div class="tabs__header">
      <div class="tabs__header__left">
        <el-tabs
          type="card"
          closable
          v-model="activeKey"
          @tab-click="changePage"
          @tab-remove="editTabItem"
        >
          <template v-for="(pageItem, index) in localTabsList">
            <el-tab-pane :name="pageItem.fullPath">
              <template #label>
                <el-dropdown
                  style="line-height: inherit;"
                  placement="bottom-start"
                  trigger="contextmenu"
                  @command="handleCommand($event, target, pageItem)"
                >
                  <span>{{ pageItem.meta?.title }}</span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="1" :icon="Refresh">刷 新</el-dropdown-item>
                      <el-dropdown-item command="2" :icon="Close">关 闭</el-dropdown-item>
                      <el-dropdown-item command="3" :icon="DArrowLeft">关闭左侧</el-dropdown-item>
                      <el-dropdown-item command="4" :icon="DArrowRight">关闭右侧</el-dropdown-item>
                      <el-dropdown-item command="5" :icon="Switch">关闭其他</el-dropdown-item>
                      <el-dropdown-item command="6" :icon="Remove">关闭全部</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <div class="tabs__header__right">
        <el-icon class="tabs__header__more" @click="handleCommand('1')">
          <refresh />
        </el-icon>
        <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand($event)">
          <el-icon class="tabs__header__more">
            <More />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="2" :icon="Close">关 闭</el-dropdown-item>
              <el-dropdown-item command="5" :icon="Switch">关闭其他</el-dropdown-item>
              <el-dropdown-item command="6" :icon="Remove">关闭全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="tabs__view__content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, unref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  Close,
  Refresh,
  More,
  DArrowLeft,
  DArrowRight,
  Remove,
  Switch,
} from "@element-plus/icons-vue";
import { useTabsStore } from '@/store/modules/tabs'
import { useAppStore } from '@/store/modules/app'
import { TABS_ROUTES } from "@/store/mutation-types";
import { allowList, defaultRoutePath } from "@/router/router-guards";
import { createStorage } from "~utils/Storage";

defineOptions({
  name: 'TabsView',
})

const Storage = createStorage({ storage: sessionStorage });
const $route = useRoute();
const $router = useRouter();
const TabsStore = useTabsStore();
const AppStore = useAppStore()

const activeKey = ref(null);
const localTabsList = computed(() => TabsStore.tabsList)

// 获取简易的路由对象
const getSimpleRoute = (route) => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};

/**
 * 获取缓存中的tabs信息
 * =================================================================================
 */
let routes = [];
try {
  const routesStr = Storage.get(TABS_ROUTES);
  routes = routesStr ? JSON.parse(routesStr) : [getSimpleRoute($route)];
} catch (e) {
  routes = [getSimpleRoute($route)];
}
// 初始化标签页
TabsStore.addTabs(routes)
/**
 * =================================================================================
 */

watch(
  () => $route.fullPath,
  (to) => {
    // 不存在的路由
    const notFondRoutes = [];
    localTabsList.value.forEach((item) => {
      if (!$router.hasRoute(item.name)) {
        notFondRoutes.push(item.name);
      }
    });
    // 过滤不存在的路由
    if (notFondRoutes.length) {
      TabsStore.initTabs(localTabsList.value.filter((item) => !notFondRoutes.includes(item.name)))
    }
    // 不在白名单 新增tabs信息
    if (allowList.includes($route.name)) return;
    activeKey.value = to;
    TabsStore.addTabs(getSimpleRoute($route))
  },
  { immediate: true }
);
// 在页面关闭或刷新之前，保存数据
window.addEventListener("beforeunload", () => {
  Storage.set(TABS_ROUTES, JSON.stringify(localTabsList.value));
});
// 移除缓存组件名称
const delKeepAliveCompName = () => {
  if ($route.meta.keepAlive) {
    const name = $router.currentRoute.value.matched.find(
      (item) => item.name == $route.name
    )?.components?.default.name;
    if (name) {
      AppStore.setkeepAliveComponents(AppStore.keepAliveComponents.filter((item) => item != name))
    }
  }
};
// 切换tabItem
const changePage = (e) => {
  if (e.paneName !== $route.fullPath) $router.push(e.paneName);
};
// 删除tabItem
const editTabItem = (value) => {
  closeHandler(
    "2",
    localTabsList.value.find((item) => item.path === value)
  );
};
// 菜单点击事件
const handleCommand = (type, target, pageItem) => {
  closeHandler(type, pageItem || $route);
};
// 关闭事件调度
const closeHandler = (type, route) => {
  switch (type) {
    case "1": // 刷新
      delKeepAliveCompName();
      $router.push({
        path: "/redirect" + unref(route).fullPath,
      });
      break;
    case "2": // 关闭当前页
      if (localTabsList.value.length === 1) {
        return ElMessage.warning("这已经是最后一页，不能再关闭了！");
      }
      delKeepAliveCompName();
      TabsStore.closeCurrentTabs(route)
      // 如果关闭的是当前页
      if ($route.fullPath === activeKey.value) {
        const currentRoute =
          localTabsList.value[Math.max(0, localTabsList.value.length - 1)];
        activeKey.value = currentRoute.fullPath;
        $router.replace(currentRoute);
      }
      break;
    case "3": // 关闭左侧
      TabsStore.closeLeftTabs(route)
      activeKey.value = route.fullPath;
      $router.replace(route.fullPath);
      break;
    case "4": // 关闭右侧
      TabsStore.closeRightTabs(route)
      activeKey.value = route.fullPath;
      $router.replace(route.fullPath);
      break;
    case "5": // 关闭其他
      TabsStore.closeOtherTabs(route)
      activeKey.value = route.fullPath;
      $router.replace(route.fullPath);
      break;
    case "6": // 关闭全部
      TabsStore.closeAllTabs(route)
      activeKey.value = route.fullPath;
      $router.replace(defaultRoutePath);
      break;
  }
};
</script>

<style lang="scss" scoped>
.tabs__view {
  width: 100%;
  height: 100%;
  border-top: 1px solid #eee;
  overflow: hidden;

  .tabs__header {
    display: flex;
    min-height: 56px;

    .tabs__header__left {
      flex: 1;
      :deep(.el-tabs__header) {
        min-height: 41px;
      }
    }
    .tabs__header__right {
      display: flex;
      align-items: center;
      height: 41px;
      padding-right: 10px;
      border-bottom: 1px solid var(--el-border-color-light);

      cursor: pointer;

      .tabs__header__more {
        display: inline-block;
        margin-left: 14px;
        color: var(--el-color-primary);
        padding: 8px 0;
      }
    }
  }
}
.tabs__view__content {
  width: 100%;
  height: calc(100vh - 176px);
  padding: 0 14px;
  overflow-y: scroll;
}
</style>
