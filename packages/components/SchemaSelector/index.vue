<template>
  <div class="schema__selector__cantainer">
    <SchemaForm
      :fields="fields"
      :form-schema="selectorOption"
      :selectOptions="selectOptions"
      :label-width="labelWidth"
      :size="formSize"
      :label-position="labelPosition"
    >
      <template #action>
        <div class="action__container">
          <el-button type="primary" :size="formSize" @click="confirmHadler">搜 索</el-button>
          <el-button :size="formSize" @click="resetHadler">重 置</el-button>
          <template v-if="showExpand">
            <div class="selector__action__expand" @click="collapseHandler">
              <span>{{ collapse ? '收起筛选' : '更多筛选' }}</span>
              <el-icon :class="{ active: collapse }">
                <ArrowDown />
              </el-icon>
            </div>
          </template>
        </div>
      </template>
    </SchemaForm>
  </div>
</template>

<script>
export default {
  name: "SchemaSelector",
  inheritAttrs: false,
};
</script>

<script setup>
import { computed, nextTick, ref } from "vue";
import { cloneDeep } from "@monorepo/utils/lodashChunk";
import { ElButton } from "element-plus";
import { ArrowDown } from '@element-plus/icons-vue'
import SchemaForm from "../SchemaForm/SchemaForm.vue";
import { triggerWindowResizeEvent } from '@monorepo/utils/util'

/**
 * v-model:fields 绑定的值
 * 须传入一个 ref
 * 或者是一个 reactive 对象的子集 
 * 正确:
 *  v-model:fields="fields"
 *    fields = ref({})
 *  v-model:fields="data.fields"
 *    data = reactive({ fields: {} })
 * 错误: 
 *  fields = reactive({})
 */

const $emit = defineEmits(["confirm", "update:fields"]);

const props = defineProps({
  formSchema: {
    required: true,
    type: Array,
  },
  fields: {
    required: true,
    type: Object,
  },
  selectOptions: {
    type: Object,
    default: () => ({}),
  },
  formSize: {
    type: String,
    default: "default",
  },
  labelPosition: {
    type: String,
    default: "left",
  },
  labelWidth: {
    type: [String, Number],
    default: 100,
  },
  defaultLayout: {
    type: Object,
    default: () => ({ xl: 6, lg: 6, sm: 12, xs: 24 }),
  },
  collapseCount: {
    type: Number,
    default: 3
  }
});

const collapse = ref(false)
const showExpand = computed(() => props.formSchema.length > props.collapseCount)
const selectorOption = computed(() => {
  const list = props.formSchema.map(i => {
    if (!i.layout) i.layout = props.defaultLayout
    return i
  })
  const localOptions = []
  if (showExpand.value && !collapse.value) {
    localOptions.push(...list.slice(0, props.collapseCount))
  } else {
    localOptions.push(...list)
  }
  localOptions.push({
    field: "action",
    type: "slot",
    props: { label: "", labelWidth: 1 },
    layout: props.defaultLayout
  })
  return localOptions
});

// 备份初始化数据
const backupFileds = cloneDeep(props.fields);

const collapseHandler = () => {
  collapse.value = !collapse.value
  nextTick(() => triggerWindowResizeEvent())
}

const confirmHadler = () => {
  $emit("confirm", { type: "confirm", data: props.fields });
};

const resetHadler = () => {
  $emit("update:fields", cloneDeep(backupFileds));
  $emit("confirm", { type: "reset", data: { ...backupFileds } });
};
</script>

<style scoped lang="scss">
.schema__selector__cantainer {
  .action__container {
    width: 100%;
    display: flex;
    align-items: center;
    .selector__action__expand {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 10px;

      & > span {
        width: max-content;
        padding: 0 4px 0 10px;
        color: #409eff;
      }
      .el-icon {
        transition: all 0.3s;
      }

      .active {
        transform: rotateZ(180deg);
      }
    }
  }
}
</style>
