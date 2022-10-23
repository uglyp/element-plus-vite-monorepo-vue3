<template>
  <BasicCard title="Form Schema">
    <template #extra>
      <el-button text>more</el-button>
    </template>

    <SchemaForm
      :ref="setSchemaFormRef"
      :fields="fields"
      :rules="SchemaFormRules"
      :form-schema="dynamicForm"
      :selectOptions="SchemaFormSelectOptions"
      :label-width="120"
    ></SchemaForm>
    <el-row type="flex" :gutter="10" justify="end" style="margin-bottom: 20px">
      <el-col :span="2">
        <el-button type="primary" @click="restHandler">重置</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="confirmHandler">确认</el-button>
      </el-col>
    </el-row>
  </BasicCard>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { SchemaForm, BasicCard } from "~components";
import { getFormSchema } from "./schema-form";

defineOptions({
  name: "FormSchemaView",
});

const SchemaFormRef = ref(null);
const setSchemaFormRef = (el) => (SchemaFormRef.value = el);

const fields = reactive({
  name: "小明",
  gender: 1,
  occupation: [],
});

const dynamicForm = getFormSchema();

let SchemaFormRules = ref({
  name: [{ required: true, message: "请输入姓名", trigger: ["blur"] }],
  gender: [{ required: true, message: "请选择性别", trigger: ["change"] }],
  age: [
    { required: false, message: "请输入年龄", trigger: ["change"] },
    { pattern: /^\d{1,}$/, message: "只能输入正整数", trigger: ["change"] },
  ],
  desc: [{ required: true, message: "请输入个人简介", trigger: ["blur"] }],
});

const SchemaFormSelectOptions = reactive({
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

watch(
  () => fields.gender,
  (newV) => {
    if (newV === 1) {
      SchemaFormRules.value.age[0].required = false;
    } else {
      SchemaFormRules.value.age[0].required = true;
    }
  }
);

const confirmHandler = () => {
  SchemaFormRef.value
    .validate((valid, form) => {
      console.log(valid, form);
    })
    .catch((err) => {
      // 捕获校验未通过数据并使页面滚动到相应位置
      const { valid, fields, arg } = err;
      const validKeys = Object.keys(arg);
      SchemaFormRef.value.scrollToField(validKeys[0]);
    });
};
const restHandler = () => {
  SchemaFormRef.value.resetFields();
};
</script>
