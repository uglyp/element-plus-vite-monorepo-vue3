import { useModal } from "../useModal/index";
import FormDialog from "./form-dialog.vue";

// interface Options {
//   handleOk: (modelRef: any, state) => Promise<any> // 点击提交表单
//   formSchema: FormSchema // 表单描述属性
//   formAttr: ElForm // 表单 Attributes
//   rules: Array // 表单校验
//   fields?: object // 字段默认填充值，一般编辑表单是传入
// }

/**
 * 创建表单弹窗
 */
export const useFormModal = (options) => useModal(FormDialog, options);
