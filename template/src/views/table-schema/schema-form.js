import { createVNode, reactive, watch, ref } from "vue";
import { UploadFile, WangEditor } from "~components";
import { useFormModal } from "~hooks";
import { fileUploadApi } from "@/api/common";

// 表单配置数据
const getFormSchema = () => [
  {
    field: "name",
    type: "input",
    props: { label: "姓名" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "gender",
    type: "select",
    props: { label: "性别" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      filterable: true,
      onChange: (e) => {
        console.log("on-change: ", e);
      },
    },
  },
  {
    field: "age",
    type: "input",
    props: { label: "年龄" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "height",
    type: "input-number",
    props: { label: "身高" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "birthday",
    type: "date-picker",
    props: { label: "出生日期" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      type: "daterange",
      format: "YYYY-MM-DD HH:mm",
      valueFormat: "YYYY-MM-DD HH:mm",
      placeholder: "请选择",
    },
  },
  {
    field: "eatDinnerTime",
    type: "time-picker",
    props: { label: "用餐时间" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      isRange: true,
      format: "HH:mm",
      valueFormat: "HH:mm",
      placeholder: "请选择",
    },
  },
  {
    field: "workingTime",
    type: "time-select",
    props: { label: "上班时间" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      start: "07:00",
      end: "13:00",
      step: "00:30",
      placeholder: "请选择时间",
    },
  },
  {
    field: "single",
    type: "switch",
    props: { label: "是否单身" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      activeText: "是",
      inactiveText: "否",
    },
  },
  {
    field: "loveHistory",
    type: "radio",
    props: { label: "有无恋爱经验" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "occupation",
    type: "checkbox",
    props: { label: "主要经济来源" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "like",
    type: "cascader",
    props: { label: "兴趣爱好" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      showAllLevels: false,
      clearable: true,
      collapseTags: true,
      props: {
        expandTrigger: "hover",
        emitPath: false,
        multiple: true,
      },
    },
  },
  {
    field: "desc",
    type: "textarea",
    props: { label: "简介" },
    layout: { span: 24 },
    attr: {
      maxLength: 30,
      placeholder: "请输入内容",
    },
  },
  {
    field: "selfFile",
    type: createVNode(UploadFile, {
      listType: "text",
      multiple: true,
      uploadFn: fileUploadApi,
    }),
    props: { label: "本人生活照" },
    layout: { span: 24 },
  },
  {
    field: "selfDesc",
    type: createVNode(WangEditor, { height: 500 }),
    props: { label: "个人介绍" },
    attr: { height: 300 },
    layout: { span: 24 },
  },
];
// 表单选项配置
const SchemaFormSelectOptions = ref({
  gender: [
    { label: "女", value: 0, customLabel: "0-女" },
    { label: "男", value: 1 },
  ],
  loveHistory: [
    { label: "工作", value: 0 },
    { label: "其他", value: 1 },
  ],
  occupation: [
    { label: "上班", value: 0 },
    { label: "啃老", value: 1 },
  ],
  like: [
    {
      label: "声乐",
      value: "1",
      children: [
        {
          value: "1-1",
          label: "乐器",
          children: [
            { label: "吉他", value: "1-1-1" },
            { label: "钢琴", value: "1-1-2" },
          ],
        },
        {
          value: "1-2",
          label: "舞蹈",
          children: [
            { label: "宅舞", value: "1-2-1" },
            { label: "民族舞", value: "1-2-2" },
          ],
        },
      ],
    },
    {
      label: "表演",
      value: "2",
      children: [
        {
          value: "2-1",
          label: "话剧",
          children: [
            { label: "抒情", value: "2-1-1" },
            { label: "历史", value: "2-1-2" },
          ],
        },
        {
          value: "1-2",
          label: "电影",
          children: [
            { label: "武打", value: "2-2-1" },
            { label: "现代", value: "2-2-2" },
          ],
        },
      ],
    },
  ],
});
/**
 * FormState 定义表单数据
 * fileds 表单数据
 * rules 校验规则
 */
export const FormState = reactive({
  fileds: {},
  rules: {
    name: [{ required: true, message: "请输入姓名", trigger: ["blur"] }],
    gender: [{ required: true, message: "请选择性别", trigger: ["change"] }],
    age: [
      { required: false, message: "请输入年龄", trigger: ["change"] },
      { pattern: /^\d{1,}$/, message: "只能输入正整数", trigger: ["change"] },
    ],
  },
});
/**
 * 重置表单信息
 */
const resetFormState = () => {
  FormState.fileds = {};
};
/**
 * 动态改变校验规则
 */
watch(
  () => FormState.fileds.gender,
  (newVal) => {
    if (newVal === 1) {
      FormState.rules.age[0].required = false;
    } else {
      FormState.rules.age[0].required = true;
    }
  }
);

// showFormModal
export const showFormModal = (params, callback) => {
  useFormModal({
    title: params.title,
    width: 1200,
    closeOnClickModal: false,
    formAttr: { labelWidth: 100 },
    formSchema: getFormSchema(),
    formSelectOptions: SchemaFormSelectOptions,
    fields: params.fields,
    rules: FormState.rules,
    handleOk: (modelRef) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resetFormState();
          typeof callback === "function" && callback(modelRef);
          resolve();
        }, 2000);
      });
    },
    closed: () => resetFormState(),
  });
};
