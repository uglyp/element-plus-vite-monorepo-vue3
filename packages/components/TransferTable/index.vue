<template>
  <div class="transfer__table__container">
    <div class="transfer__left__table">
      <div class="transfer__table__title">源列表</div>
      <div class="transfer__table__content">
        <SchemaSelector
          v-if="selectorFormOptions.length"
          formSize="small"
          v-model:fields="queryInfo"
          :form-schema="selectorFormOptions"
          :select-options="selectorSelectDataOptions"
          labelWidth="75px"
          :defaultLayout="{ span: 12 }"
          @confirm="refreshTable"
        ></SchemaSelector>

        <SchemaTable
          ref="leftSchemaTableRef"
          :rowKey="rowKey"
          size="small"
          :data="loadData"
          :columns="leftColumns"
          :rowSelection="leftTableSelectChange"
          :pagination="pagination"
          @loaded="updateLeftSelectedRow"
        ></SchemaTable>
      </div>
    </div>

    <div class="transfer__middle__container">
      <el-button size="small" type="primary" :disabled="leftActionDisabled" @click="toRightHandler">
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
      <el-button
        size="small"
        type="primary"
        style="margin-left: 0;margin-top: 10px;"
        :disabled="rightActionDisabled"
        @click="toLeftHandler"
      >
        <el-icon>
          <ArrowLeft />
        </el-icon>
      </el-button>
    </div>

    <div class="transfer__right__container">
      <div class="transfer__table__title">目标列表</div>
      <div class="transfer__table__content">
        <SchemaTable
          ref="rightSchemaTableRef"
          :rowKey="rowKey"
          size="small"
          :data="loadRightData"
          :columns="rightColumns"
          :rowSelection="rightTableSelectChange"
          :pagination="pagination"
        ></SchemaTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useLeftTable, useRightTable } from './useTransferTable'

defineOptions({
  name: 'TransferTable'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  rowKey: {
    required: true,
    type: String,
  },
  modelValue: {
    required: true,
    type: Array,
    default: () => []
  },
  defaultQueryParams: {
    type: Object,
    default: () => ({})
  },
  selectorFormOptions: {
    type: Array,
    default: () => []
  },
  selectorSelectDataOptions: {
    default: Object,
  },
  leftColumns: {
    required: true,
    type: Array,
    default: () => []
  },
  rightColumns: {
    required: true,
    type: Array,
    default: () => []
  },
  loadTableData: {
    required: true,
    type: Function,
  },
  pagination: {
    type: Object,
    default: () => ({
      layout: 'total,prev,pager,next',
      pageSize: 10
    })
  }
})

const queryInfo = ref({})
queryInfo.value = Object.assign({}, props.defaultQueryParams)

const {
  leftSchemaTableRef,
  leftTableSelectRows,
  leftActionDisabled,
  loadData,
  leftTableSelectChange,
  refreshTable
} = useLeftTable({
  props,
  queryInfo
})

const {
  rightSchemaTableRef,
  rightTableSelectRows,
  rightActionDisabled,
  loadRightData,
  rightTableSelectChange,
} = useRightTable({
  props,
  queryInfo
})

function toRightHandler() {
  const tempData = leftTableSelectRows.value.filter(row => props.modelValue.findIndex(i => i[props.rowKey] === row[props.rowKey]) === -1)
  const updateData = props.modelValue.concat(tempData)
  emit("update:modelValue", updateData);
};

function toLeftHandler() {
  const localIds = rightTableSelectRows.value.map((i) => i[props.rowKey]);
  const localRows = props.modelValue.filter(
    (i) => !localIds.includes(i[props.rowKey])
  );
  emit("update:modelValue", localRows);
};

/**
 * 更新右侧列表数据
 * 同时更新左侧表单选中数据
 */
function trigger() {
  nextTick(() => {
    rightSchemaTableRef.value.refresh(false)
    updateLeftSelectedRow()
  })
}

function updateLeftSelectedRow() {
  leftSchemaTableRef.value.localData?.forEach(row => {
    const findIndex = props.modelValue.findIndex(item => item[props.rowKey] === row[props.rowKey])
    const flag = findIndex !== -1
    leftSchemaTableRef.value.toggleRowSelection(row, flag)
  })
}

watch(() => props.modelValue, () => trigger(), {
  immediate: true,
  deep: true
})

</script>

<style lang="scss" scoped>
.transfer__table__container {
  width: inherit;
  height: 100%;
  display: flex;

  .transfer__left__table {
    display: flex;
    flex-direction: column;
    flex: 1.5;
    height: 100%;
    overflow: hidden;
  }

  .transfer__middle__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 45px;
  }

  .transfer__right__container {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .transfer__table__title {
    width: 100%;
    border: 1px solid #ececec;
    padding: 6px 10px;
    font-size: 8px;
    text-align: right;
  }
  .transfer__table__content {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ececec;
    border-top: none;
  }
}
</style>