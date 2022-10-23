import { useModal } from "../useModal/index";
import PdfDialog from "./form-dialog.vue";

// interface Options {
//   src: String | ArrayBuffer; // 数据
//   defaultScale: Number; // 默认缩放比例
//   height: String | Number; // 高度
//   title: String; // 标题
//   handleOk: (modelRef: any, state) => Promise<any>; // 点击提交表单
// }

/**
 * 创建Pdf弹窗
 */
export const usePdfModal = (options) => useModal(PdfDialog, options);
