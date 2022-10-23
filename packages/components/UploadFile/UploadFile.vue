<template>
  <el-upload
    action="#"
    :disabled="disabled"
    :accept="accept"
    :limit="limit"
    :drag="drag"
    :multiple="multiple"
    :before-upload="beforUpload"
    :list-type="listType"
    :file-list="fileList"
    :on-remove="onRemove"
    :on-preview="onPreview"
    :on-exceed="onExceed"
  >
    <template #default>
      <slot name="default" v-if="$slots.default"></slot>
      <template v-else>
        <i class="el-icon-plus" v-if="listType === 'picture-card'"></i>
        <el-button type="primary" v-else>上传文件</el-button>
      </template>
    </template>

    <template #tip>
      <slot name="tip"></slot>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, toRaw, watch } from "vue";
import { ElUpload, ElButton, ElMessage } from "element-plus";
import { uuId } from "@monorepo/utils/util";
import { isEqual } from "@monorepo/utils/lodashChunk";

defineOptions({
  name: "UploadFile",
  inheritAttrs: false,
});

// 初始化 props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 3,
  },
  listType: {
    type: String,
    default: "text",
  },
  accept: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  drag: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  /**
   * 上传方法，必传参数
   * 返回一个 Promise
   */
  uploadFn: {
    typeof: Function,
    required: true,
    default: () => Promise.resolve(),
  },
  //上传附带参数
  uploadParams: {
    type: Object,
    default: () => ({}),
  },
});
// 初始化 emit
const emit = defineEmits(["update:modelValue", "remove"]);

let fileList = ref([]);

const init = () => {
  if (Array.isArray(props.modelValue) && props.modelValue.length) {
    fileList.value = props.modelValue.map((item) => ({
      uid: uuId(),
      name: item.name,
      status: "success",
      url: item.url,
    }));
  } else {
    fileList.value = [];
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!isEqual(newVal, fileList.value)) init();
  },
  {
    immediate: true,
  }
);

// 更新数据
const emitChange = () => {
  const _fileList = fileList.value.map((item) => ({ ...item }));
  emit("update:modelValue", _fileList);
};
// 自定义上传
const beforUpload = (file) => {
  props.uploadFn(file, props.uploadParams).then((res) => {
    const { code, data, msg } = res;
    if (code === 0) {
      fileList.value.push({
        uid: uuId(),
        name: file.name,
        status: "success",
        url: data?.url,
      });
      emitChange();
    }
  });
  return false;
};

const onRemove = (file) => {
  if (file.status === "success") {
    fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
    emit("remove", toRaw(file));
    emitChange();
  }
};

const onExceed = () => {
  ElMessage({
    showClose: true,
    message: "超出最大上传数量",
    type: "warning",
  });
};

const onPreview = (file) => {
  console.log(file);
};
</script>
