import { createApp } from "vue";
import App from "./App.vue";
import { setupStore } from "@/store";
import { setupRouter } from "@/router";
import { setupElement } from "@/plugins";

//注册mock
import "./mock";

const app = createApp(App);

function setupPlugins() {
  // 注册Element组件
  setupElement(app);
}

async function setupApp() {
  // 挂载pinia状态管理
  setupStore(app);
  // 挂载路由
  await setupRouter(app);

  app.mount("#app");
}

setupPlugins();

setupApp();
