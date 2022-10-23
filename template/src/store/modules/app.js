import { defineStore } from "pinia";
import { store } from "@/store";
import { createStorage } from "~utils/Storage";
import { APP_KEY } from "@/store/mutation-types";
const Storage = createStorage({ storage: localStorage });

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    appKey: Storage.get(APP_KEY, "APP_KEY"),
    keepAliveComponents: [],
    clickCount: 0,
    globalTip: ''
  }),
  actions: {
    setAppKey(appKey) {
      this.appKey = appKey;
    },
    setkeepAliveComponents(list) {
      this.keepAliveComponents = list;
    },
  },
});

// 在组件setup函数外使用
export function useAppStoreWithOut() {
  return useAppStore(store);
}
