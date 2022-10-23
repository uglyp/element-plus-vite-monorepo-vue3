import RouteTransition from "@/layout/RouteTransition.vue";
import { Compass } from "@element-plus/icons-vue";

const routeName = "dashboard";

const routes = [
  {
    path: "/dashboard",
    name: routeName,
    redirect: "/dashboard-view",
    component: RouteTransition,
    meta: {
      title: "首页",
      icon: Compass,
      permission: ["dashboard"],
      target: "menuItem",
    },
    children: [
      {
        path: "/dashboard-view",
        name: `${routeName}-view`,
        meta: {
          title: "首页-view",
          permission: ["dashboard"],
          keepAlive: true,
          target: "sonMenu",
        },
        component: () => import("@/views/dashboard/dashboard.vue"),
      },
    ],
  },
];

export default routes;
