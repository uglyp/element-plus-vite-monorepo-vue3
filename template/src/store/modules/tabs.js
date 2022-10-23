import { defineStore } from "pinia";
import { store } from "@/store";

import { TABS_ROUTES } from "../mutation-types";
import { createStorage } from "~utils/Storage";
const Storage = createStorage({ storage: localStorage });

// 不需要出现在标签页中的路由
import { allowList } from "@/router/router-guards";
const whiteList = [...allowList];

export const useTabsStore = defineStore({
  id: "tabs",
  state: () => ({
    tabsList: [],
  }),
  actions: {
    initTabs(routes) {
      this.tabsList = routes;
    },
    addTabs(route) {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabsList.some(
        (item) => item.fullPath == route.fullPath
      );
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    loseLeftTabs(route) {
      // 关闭左侧
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList.splice(0, index);
    },
    closeRightTabs(route) {
      // 关闭右侧
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList.splice(index + 1);
    },
    closeOtherTabs(route) {
      // 关闭其他
      this.tabsList = this.tabsList.filter(
        (item) => item.fullPath == route.fullPath
      );
    },
    closeCurrentTabs(route) {
      // 关闭当前页
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList.splice(index, 1);
    },
    closeAllTabs() {
      // 关闭全部
      this.tabsList = [];
      Storage.remove(TABS_ROUTES);
    },
  },
});

export const useTabsStoreWithOut = () => {
  return useTabsStore(store);
};
