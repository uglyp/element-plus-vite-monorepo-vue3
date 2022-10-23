import { createVNode } from "vue";
import { UploadFile, WangEditor } from "~components";
import { fileUploadApi } from "@/api/common";

export const getFormSchema = () => [
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
      uploadParams: { type: 1 },
      onRemove: (file) => console.log("fileRemove: ", file),
    }),
    props: { label: "本人生活照" },
    layout: { span: 24 },
  },
  {
    field: "selfDesc",
    type: createVNode(WangEditor, { height: 500 }),
    props: { label: "个人介绍" },
    layout: { span: 24 },
  },
];
