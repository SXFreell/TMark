const routes = [
  {
    path: "/",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/dev",
    name: "dev",
    component: () => import("@/views/dev/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 自定义正则表达式以匹配所有路径
    redirect: "/", // 或者重定向到其他页面，例如首页 "/"
  },
];

export default routes;
