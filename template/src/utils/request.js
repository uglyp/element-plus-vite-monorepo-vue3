import { HttpRequest } from "~utils/http";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { useAppStoreWithOut } from "@/store/modules/app";
// import { useUserStoreWithOut } from '@/store/modules/user'

const AppStore = useAppStoreWithOut();
// const UserStore = useUserStoreWithOut()

const httpConfig = {
  /**
   * 请求拦截钩子
   * @params {config} axios 请求拦截钩子参数
   */
  request(config) {
    //  一般增加一些token属性等
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (token) config.headers[ACCESS_TOKEN] = token;
    return config;
  },
  /**
   * 自定义响应处理 必须返回一个 Promise 状态   [resolve, reject]
   * 使用自定义响应处理则 公共 http响应成功 处理失效
   */
  // response(result) {
  //   return  Promise.resolve(result)
  // },
  /**
   * 401 重定向钩子
   */
  // redirect() {
  // UserStore.Logout().then(() => {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1500);
  // });
  // },
};

const http = new HttpRequest(httpConfig);

export default {
  request: http.request,
  post: http.post,
  get: http.get,
  put: http.put,
  delete: http.delete,
};
