<template>
  <div class="pdf__hooks__modal">
    <ElDialog fullscreen v-model:model-value="visible" @closed="closedHandler">
      <PdfView :src="src" :title="title" :height="height" :defaultScale="defaultScale"></PdfView>
    </ElDialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { PdfView } from "~components";
import { ElDialog, ElButton, ElLoading } from "element-plus";

const props = defineProps({
  remove: {
    // 移除模态框
    type: Function,
  },
  closed: {
    // 窗口关闭
    type: Function,
  },
  src: {
    type: [String, ArrayBuffer]
  },
  defaultScale: {
    type: Number,
    default: 1
  },
  height: {
    type: [String, Number],
  },
  title: {
    type: String,
    default: '预览'
  }
});

let FormLoadingInstance = null;


const confirmLoading = ref(false);
const visible = ref(true);

const closedHandler = () => {
  props.remove();
  props.closed && props.closed();
};

watch(
  () => confirmLoading.value,
  (newVal) => {
    if (newVal) {
      if (FormLoadingInstance) return;
      FormLoadingInstance = ElLoading.service({
        target: ".hooks__form__modal .el-dialog__body",
        background: "rgba(255,255,255,0.4)",
      });
    } else {
      // 以服务的方式调用的 Loading 需要异步关闭
      FormLoadingInstance.close();
      FormLoadingInstance = null;
    }
  }
);
</script>

<style lang="scss">
.pdf__hooks__modal {
  background: pink;
  .el-dialog__headerbtn {
    width: 40px;
    height: 40px;
  }

  .el-dialog__body {
    height: calc(100vh - 60px);
    max-height: none;
    padding: 10px 20px;
  }

  .form__dialog__footer {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
}
</style>
