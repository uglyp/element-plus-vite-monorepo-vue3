import { Link } from "@element-plus/icons-vue";

const routes = [
  // 外部链接
  {
    path: "https://www.baidu.com/",
    name: "baidu",
    meta: {
      icon: Link,
      title: "百度",
      target: "_blank",
      permission: ["dashboard"],
    },
  },
];

export default routes;
