<template>
  <div class="dashboard__container">
    <p>
      <a href="https://vitejs.dev/" target="_blank">Vite Documentation</a>
      |
      <a href="https://vuejs.org/" target="_blank">Vue 3 Documentation</a>
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>

    <p>
      <el-icon color="#409EFF" :size="28">
        <CoffeeCup />
      </el-icon>
      <SvgIcon name="demo" :size="28"></SvgIcon>
    </p>

    <el-row type="flex" justify="center">
      <UploadFile drag :uploadFn="fileUploadApi" :uploadParams="{ type: 2 }" v-model:modelValue="fileList"
        @remove="uploadRemoveHandler">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
        </template>
      </UploadFile>
    </el-row>

    <el-button typeof="primary" @click="priviewPdf">pdf预览</el-button>

    <el-row type="flex" justify="center">
      <el-button typeof="primary" @click="clickHandler">{{ clickCount }}</el-button>
    </el-row>
    <el-row type="flex" justify="center">
      <el-input v-model="globalTip" placeholder="这里是 pinia 中 state 的双向绑定数据"></el-input>
    </el-row>
    <p>{{ globalTip }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CoffeeCup, UploadFilled } from '@element-plus/icons-vue'
import { UploadFile, SvgIcon, PdfView } from '~components'
import { fileUploadApi } from "@/api/common";
import { usePdfModal } from '~hooks'
import pdfFile from '../../assets/pdf-demo.pdf'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app.js'

defineOptions({
  name: 'DashboardView',
})

const fileList = ref([])
function uploadRemoveHandler(file) {
  console.log('removeFile: ', file);
}

function priviewPdf() {
  usePdfModal({
    // title: 'PDF Title',
    defaultScale: 1,
    src: pdfFile,

  })
}

const { clickCount, globalTip } = storeToRefs(useAppStore())
function clickHandler() {
  clickCount.value += 1
}

</script>

<style scoped>
.dashboard__container {
  text-align: center;
}

a {
  color: #42b983;
}
</style>