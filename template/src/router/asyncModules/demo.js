import RouteTransition from "@/layout/RouteTransition.vue";
import { DataBoard } from "@element-plus/icons-vue";

const routeName = "demo";

const routes = [
  {
    path: "/demo",
    name: routeName,
    redirect: "/demo-table",
    meta: {
      title: "示例",
      icon: DataBoard,
      permission: ["dashboard"],
    },
    component: RouteTransition,
    children: [
      {
        path: "/demo-table",
        name: `${routeName}-table`,
        meta: {
          title: "表格-schema",
          permission: ["dashboard"],
          keepAlive: true,
        },
        component: () => import("@/views/table-schema/table-schema.vue"),
      },
      {
        path: "/demo-form",
        name: `${routeName}-form`,
        meta: {
          title: "表单-schema",
          permission: ["dashboard"],
          keepAlive: false,
        },
        component: () => import("@/views/form-schema/form-schema.vue"),
      },
    ],
  },
];

export default routes;
