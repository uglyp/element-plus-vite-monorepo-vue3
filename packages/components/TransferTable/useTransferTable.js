import { computed, ref, unref } from "vue";

/**
 * 左侧表格
 */
export function useLeftTable({ props, queryInfo }) {
  const leftSchemaTableRef = ref(null);

  const leftTableSelectRows = ref([]);
  const leftActionDisabled = computed(
    () => leftTableSelectRows.value.length < 1
  );

  const loadData = (parameter) => {
    const params = {
      ...unref(queryInfo),
    };
    return props.loadTableData(Object.assign({}, params, parameter));
  };

  const leftTableSelectChange = (rows) => (leftTableSelectRows.value = rows);

  function refreshTable() {
    leftSchemaTableRef.value.refresh(true);
  }

  return {
    leftSchemaTableRef,
    leftTableSelectRows,
    leftActionDisabled,
    loadData,
    leftTableSelectChange,
    refreshTable,
  };
}

/**
 * 右侧表格
 */
export function useRightTable({ props, queryInfo }) {
  const rightSchemaTableRef = ref(null);
  const total = computed(() => props.modelValue?.length || 0);
  const pageSize = computed(() => props.pagination.pageSize || 10);

  const rightTableSelectRows = ref([]);
  const rightActionDisabled = computed(
    () => rightTableSelectRows.value.length < 1
  );
  const loadRightData = (parameter) => {
    const startIndex = pageSize.value * (parameter.pageNo - 1);
    const endIndex =
      startIndex > props.modelValue.length
        ? props.modelValue.length
        : startIndex + pageSize.value;
    const rows = props.modelValue.slice(startIndex, endIndex);

    return new Promise((resolve) => {
      const result = {
        total: total.value,
        pageSize: pageSize.value,
        pageNo: parameter.pageNo,
        rows,
      };
      resolve(result);
    });
  };
  const rightTableSelectChange = (rows) => (rightTableSelectRows.value = rows);

  return {
    rightSchemaTableRef,
    rightTableSelectRows,
    rightActionDisabled,
    loadRightData,
    rightTableSelectChange,
  };
}
