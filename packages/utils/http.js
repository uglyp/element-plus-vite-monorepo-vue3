import axios from "axios";
import { ElMessage } from "element-plus";
import { Loading } from "~components";

// 将axios 二次封装
// 每个实例的拦截器和其他人无关 ，如果使用全局的实例 那么给每次请求单独配置拦截器就做不到
let redirectFlag = false; // 重定向到登录节流阀

let loadingTimer = null; // loading 延时定时器实例
const loadingDelay = 600; // loading 延时
let loadingCounter = 0; // loading 请求计数器
let loadingInstance = null; // loading 实例
const pending = new Map(); // pending 状态的请求集合

// 取消所有pending状态的请求
function clearPending() {
  try {
    pending.forEach((cancel, key) => cancel(`请求中断: ${key}`));
  } finally {
    pending.clear();
  }
}

// 获取pending的key
function getPendingKey(config = {}) {
  return config.url + config.method;
}

// 显示全局loading
function showLoading(loadingTitle) {
  // loading计数 +1
  loadingCounter++;
  // ${loadingDelay} ms延时后，开启loading
  loadingTimer = setTimeout(() => {
    loadingInstance = Loading.service({ text: loadingTitle });
  }, loadingDelay);
}
// 关闭全局loading
function hiddenLoading() {
  // loading计数 -1
  loadingCounter--;
  // 取消loading的加载
  clearTimeout(loadingTimer);
  // 关闭loading
  loadingCounter <= 0 && loadingInstance && loadingInstance.close();
}

class HttpRequest {
  constructor(config) {
    this.__config__ = config;
    // 可以增加实例属性 后台接口的路径  开发模式和生产模式不一样 在config里新建index.js进行配置
    this.baseURL = import.meta.env.VITE_APP_API_URL; // 默认地址
    this.timeout = import.meta.env.VITE_APP_TIME_OUT; // 请求超时时间
  }
  // 创建单独的拦截器
  setInterceptors(instance) {
    // 请求拦截器 ========================================================================
    instance.interceptors.request.use((config) => {
      // 每次请求时间
      config.headers["requestTime"] = Date.parse(new Date())
        .toString()
        .substr(0, 10);
      // 是否开启loading
      const { loadingEl, loadingTitle } = config;
      if (loadingEl) showLoading(loadingTitle);
      /**
       * 拦截重复请求
       * 如需开放 重复请求 在请配置中加入 noRepeat: true
       * 详见template项目 api文件示例
       */
      if (pending.has(getPendingKey(config)) && !config.noRepeat) {
        return Promise.reject({
          __CANCEL__: true,
          message: `重复请求 API: ${config.url}; method: ${config.method}`,
          loadingEl: true,
        });
      }
      // 注册取消请求 cancelToken
      config.cancelToken = new axios.CancelToken(async (cancel) => {
        pending.set(getPendingKey(config), cancel);
      });
      // 执行自定义请求拦截
      if (typeof this.__config__?.request === "function") {
        return this.__config__.request(config) || config;
      }
      return config;
    });
    // 响应拦截器 ========================================================================
    instance.interceptors.response.use(
      async (res) => {
        // 清除请求成功的pending
        if (pending.has(getPendingKey(res.config))) {
          pending.delete(getPendingKey(res.config));
        }
        // 是否关闭loading
        if (res.config.loadingEl) hiddenLoading();
        // 服务返回的结果都会放到data中
        const { data } = res;
        // 以code 作为是否为识别，判断是否是常规请求返回内容，用作文件流下载
        if (data.code === undefined) return Promise.resolve(res.data);
        // 请求 code 统一处理
        if (res.status === 200) {
          // 执行自定义请求响应处理逻辑
          if (typeof this.__config__?.response === "function") {
            return this.__config__.response(data);
          }

          const code = data.code;
          switch (code) {
            case 0:
              return Promise.resolve(res.data);
            case 401: // token无效
              // 退出登录 重定向到登录页
              if (!redirectFlag) {
                ElMessage.error(data.message);
                redirectFlag = true;
                setTimeout(() => {
                  redirectFlag = false;
                }, 3000);
              }
              if (typeof this.__config__?.redirect === "function") {
                this.__config__.rederict();
              }
              return Promise.reject(res.data);
            default:
              // 失败
              ElMessage.error(data.message);
              return Promise.reject(res.data);
          }
        } else {
          const msg = res.message;
          ElMessage.error(msg || "网络异常");
          return Promise.reject(res.data);
        }
      },
      (error) => {
        if (!error.__CANCEL__) {
          const msg = error.message;
          ElMessage.error(msg || "网络异常");
          //中断请求
          clearPending();
        }
        if (error.loadingEl) hiddenLoading();
        return Promise.reject(error);
      }
    );
  }
  // 合并参数
  mergeOptions(options) {
    // 合并选项
    return { baseURL: this.baseURL, timeout: this.timeout, ...options };
  }
  request = (options) => {
    const instance = axios.create(); // 创建axios实例
    this.setInterceptors(instance); // 创建单独的拦截器
    const opts = this.mergeOptions(options); // 合并选项
    return instance(opts); // 单独拦截器的配置项
  };
  get = (url, config) => {
    return this.request({
      method: "get",
      url,
      ...config, // 参数可以直接展开
    });
  };
  post = (url, config) => {
    return this.request({
      method: "post",
      url,
      ...config, // 参数可以直接展开
    });
  };
  put = (url, config) => {
    return this.request({
      method: "put",
      url,
      ...config, // 参数可以直接展开
    });
  };
  delete = (url, config) => {
    // get请求 以字符串的形式传入 路径参数  ?a=1
    return this.request({
      method: "delete",
      url,
      ...config, // 参数可以直接展开
    });
  };
}

export { HttpRequest, clearPending };
