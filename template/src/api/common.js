import Http from "@/utils/request";

/**
 * 公共借口
 */
const apiConfig = {
  fileUpload: "/file/upload",
};

/**
 * @param {Object} _params
 */
export function fileUploadApi(file, _params = {}) {
  const params = new FormData();
  Object.keys(_params).forEach((key) => {
    params.append(key, _params[key]);
  });
  params.append("file", file);

  return Http.post(apiConfig.fileUpload, {
    data: params,
    loadingEl: false, // 开启全屏loading
    // noRepeat: true // 不检查重复请求
  });
}
