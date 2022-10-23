<template>
  <BasicCard title="Table Schema">
    <template #extra>
      <el-button text>more</el-button>
    </template>

    <SchemaSelector
      v-model:fields="queryInfo"
      :form-schema="selectorDynamicForm"
      :selectOptions="SchemaFormSelectOptions"
      :label-width="40"
      @confirm="selectorClickHandler"
    ></SchemaSelector>

    <SchemaMenuBar :barList="barList"></SchemaMenuBar>

    <SchemaTable
      ref="SchemaTableRef"
      index
      expand
      selection
      autoHeight
      rowKey="id"
      startColumnsFixed
      :data="loadData"
      :columns="columns"
      v-model:selectedRows="selectedRows"
      @expand="expandHandler"
      @filter-change="onFilterChange"
      @selectionChange="onSelectChange"
    >
      <template #actionHeader>
        <el-tag>操 作</el-tag>
      </template>
      <template #action="scope">
        <el-button text type="primary" @click.stop="editHandler(scope.row)">
          编辑
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <ElPopconfirm :title="`确定删除（${scope.row.name}）的信息吗？`">
          <template #reference>
            <el-button text type="primary" @click.stop="delHandler(scope.row)">
              删除
            </el-button>
          </template>
        </ElPopconfirm>
      </template>
      <template #expand="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </SchemaTable>
  </BasicCard>
</template>

<script setup>
import { markRaw, ref } from "vue";
import {
  SchemaTable,
  SchemaMenuBar,
  SchemaSelector,
  BasicCard,
} from "~components";
import { CirclePlus, Pointer } from "@element-plus/icons-vue";
import { FormState } from "./schema-form";
import { useSchemaTable } from "./schema-table";

defineOptions({
  name: "TableSchemaView",
});

// 搜索数据
const queryInfo = ref({});

// table
const {
  SchemaTableRef,
  selectedRows,
  columns,
  loadData,
  addHandler,
  editHandler,
  delHandler,
  restTable,
  initHandler,
  expandHandler,
  onSelectChange,
  onFilterChange,
} = useSchemaTable({ FormState, queryInfo });

/**
 * 搜索
 */
const selectorDynamicForm = [
  {
    field: "name",
    type: "input",
    props: { label: "姓名" },
  },
  {
    field: "gender",
    type: "select",
    props: { label: "性别" },
    attr: {
      onChange: () => {
        // change 会在绑定数据改变前触发，所以要做一个微任务延时
        setTimeout(() => restTable(), 0);
      },
    },
  },
  {
    field: "age",
    type: "input",
    props: { label: "年龄" },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "height",
    type: "input-number",
    props: { label: "身高" },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "birthday",
    type: "date-picker",
    props: { label: "生日" },
    attr: {
      type: "daterange",
      format: "YYYY-MM-DD HH:mm",
      valueFormat: "YYYY-MM-DD HH:mm",
      placeholder: "请选择",
    },
  },
];

const SchemaFormSelectOptions = ref({
  gender: [
    { label: "女", value: 0, customLabel: "0-女" },
    { label: "男", value: 1 },
  ],
});

const selectorClickHandler = ({ type, data }) => restTable();

/**
 * 菜单按钮
 */
const barList = ref([
  {
    label: "新 增",
    attr: {
      type: "primary",
      icon: markRaw(CirclePlus),
      disabled: () => queryInfo.value.gender === 1,
    },
    targetMethod: () => addHandler(),
  },
  {
    label: "选 中",
    attr: {
      type: "success",
      icon: markRaw(Pointer),
    },
    hidden: () => queryInfo.value.gender === 0,
    targetMethod: () => initHandler(),
  },
]);
</script>

<style scoped lang="scss"></style>
