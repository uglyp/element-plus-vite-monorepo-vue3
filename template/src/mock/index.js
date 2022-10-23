import { isIE } from "~utils/util";
import Mock from "mockjs";

import useMockTableList from "./services/table-list";
import useMockFileUpload from "./services/file-upload";

// 判断环境不是 production 时，加载 mock 服务
if (import.meta.env.MODE !== "production" || true) {
  if (isIE()) {
    console.error(
      "ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV."
    );
  }

  console.log("mock mounting ...");

  // 异步加载，同步加载暂未 解决
  useMockTableList();
  useMockFileUpload();

  Mock.setup({
    timeout: 1800, // setter delay time
  });

  console.log("mock mounted ...");
}
