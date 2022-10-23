import { onUnmounted } from "vue";
import mitt from "mitt";

const emitter = mitt();

// 自定义触发器
const customEmit = (eventName, arg) => {
  emitter.emit(eventName, arg);
};

// 自定义接收器
const customOn = (eventName, callback) => {
  emitter.on(eventName, () => callback());
};

// 关闭指定Emit
const closedEmit = (eventName, callback) => {
  emitter.off(eventName, callback);
};

// 通知刷新表格数据
const toRefreshTable = () => {
  emitter.emit("refreshTable");
};

// 刷新表格数据
const refreshTable = (callback) => {
  emitter.on("refreshTable", () => callback());
};

// 通知刷新树结构数据
const toRefreshTree = () => {
  emitter.emit("refreshTree");
};

// 刷新树数据
const refreshTree = (callback) => {
  emitter.on("refreshTree", () => callback());
};

export const useEventbus = () => {
  onUnmounted(() => {
    emitter.all.clear();
  });
  return {
    customEmit,
    customOn,
    closedEmit,
    toRefreshTable,
    refreshTable,
    toRefreshTree,
    refreshTree,
  };
};
