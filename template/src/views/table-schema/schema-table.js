import { ref, unref } from "vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "~utils/lodashChunk";
import { getTableList } from "@/api/table-list";
// 引入表单配置及方法
import { showFormModal } from "./schema-form";

export const useSchemaTable = ({ FormState, queryInfo }) => {
  // 表格 ref
  const SchemaTableRef = ref(null);
  // 选中行数据
  const selectedRows = ref([]);
  // 表格列 配置项
  const columns = [
    {
      width: 50,
      label: "id",
      prop: "id",
      align: "center",
      fixed: true,
    },
    {
      width: 80,
      label: "姓名",
      prop: "name",
      align: "center",
    },
    {
      label: "性别",
      align: "center",
      children: [
        {
          label: "男",
          align: "center",
          children: [
            {
              width: 80,
              label: "18+",
              prop: "gender1",
              align: "center",
            },
            {
              width: 80,
              label: "18-",
              prop: "gender2",
              align: "center",
            },
          ],
        },
        {
          width: 80,
          label: "女",
          prop: "gender3",
          align: "center",
        },
      ],
    },
    {
      width: 80,
      label: "年龄",
      prop: "age",
      align: "center",
    },
    {
      width: 80,
      label: "身高",
      prop: "height",
      align: "center",
    },
    {
      width: 120,
      label: "出生日期",
      prop: "birthday",
      align: "center",
    },
    {
      width: 120,
      label: "用餐时间",
      prop: "eatDinnerTime",
      align: "center",
    },
    {
      width: 120,
      label: "上班时间",
      prop: "workingTime",
      align: "center",
    },
    {
      width: 120,
      label: "是否单身",
      prop: "single",
      align: "center",
    },
    {
      width: 120,
      label: "有无恋爱经验",
      prop: "loveHistory",
      align: "center",
    },
    {
      width: 120,
      label: "主要经济来源",
      prop: "occupation",
      align: "center",
    },
    {
      label: "简介",
      prop: "desc",
      align: "center",
    },
    {
      width: 160,
      fixed: "right",
      label: "操作",
      prop: "gender",
      align: "center",
      slots: { default: "action", header: "actionHeader" },
    },
  ];
  // 加载数据
  const loadData = (parameter) => {
    // 这里可以对搜索参数做一些格式化的操作
    const newQueryInfo = cloneDeep(unref(queryInfo));
    if (newQueryInfo.birthday) {
      newQueryInfo.birthday = newQueryInfo.birthday.join(",");
    }
    return getTableList(Object.assign({}, newQueryInfo, parameter)).then(
      (res) => res.data
    );
  };

  // 新增事件
  const addHandler = () => {
    showFormModal({ title: "新 增", fields: FormState.fileds });
  };
  // 编辑事件
  const editHandler = (row) => {
    // clone数据，避免表单编辑时更改table中的数据
    FormState.fileds = cloneDeep(row);
    showFormModal({ title: "编 辑", fields: FormState.fileds }, () => {
      ElMessage.success("操作成功");
      SchemaTableRef.value.refresh();
    });
  };
  // 删除事件
  const delHandler = (row) => {
    console.log("delHandler: ", row);
  };
  // 重置事件
  const restTable = () => {
    SchemaTableRef.value.refresh();
  };
  // 初始化选中
  const initHandler = () => {
    const list = [{ id: 102 }, { id: 106 }];
    SchemaTableRef.value.initRowSelection(list);
  };
  const expandHandler = (expandedRows, expanded) => {
    console.log("expandHandler", { expandedRows, expanded });
  };
  const onSelectChange = (_selectedRows) => {
    console.log("onSelectChange", _selectedRows);
  };
  const onFilterChange = (filters) => {
    console.log("onFilterChange", filters);
  };

  return {
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
  };
};
