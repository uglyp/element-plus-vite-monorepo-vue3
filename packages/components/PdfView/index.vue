<template>
  <div class="pdf__view__container" :style="containerStyle">
    <div class="pdf__view__container__controller">
      <span>{{ ViewConfig.title }}</span>

      <span class="controller__btn">
        <el-tooltip effect="dark" content="上一页" placement="bottom">
          <el-icon @click="changPage(-1)">
            <ArrowLeft></ArrowLeft>
          </el-icon>
        </el-tooltip>
        <span class="controller__label">{{ ViewConfig.currentPage }}/{{ ViewConfig.pageTotal }}</span>
        <el-tooltip effect="dark" content="下一页" placement="bottom">
          <el-icon @click="changPage(1)">
            <ArrowRight></ArrowRight>
          </el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="放大" placement="bottom">
          <el-icon @click="changScale(0.1)">
            <ZoomIn></ZoomIn>
          </el-icon>
        </el-tooltip>
        <span class="controller__label">{{ ViewConfig.scale }}x</span>
        <el-tooltip effect="dark" content="缩小" placement="bottom">
          <el-icon @click="changScale(-0.1)">
            <ZoomOut></ZoomOut>
          </el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="旋转" placement="bottom">
          <el-icon @click="changeRotation(-90)">
            <RefreshLeft></RefreshLeft>
          </el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="旋转" placement="bottom">
          <el-icon @click="changeRotation(90)">
            <RefreshRight></RefreshRight>
          </el-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="pdf__view__container__body">
      <div class="pdf__view__canvas__box">
        <canvas :id="CanvasId"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, watch } from 'vue';
import { ElIcon, ElTooltip } from 'element-plus'
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'
import { uuId } from '@monorepo/utils/util';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import PdfWorkerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry.js'
import { isNumber } from '@monorepo/utils/util';
import { throttle } from '@monorepo/utils/lodashChunk'

defineOptions({
  name: 'PdfView'
})

const CanvasId = uuId()
const props = defineProps({
  /**
   * 可以是下载链接
   * 也可以是arraybuffer文件流
   */
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
})

const containerStyle = computed(() => ({
  height: `${props.height}${isNumber(props.height) ? 'px' : ''}`
})
)

let PDFInstance = null
const ViewConfig = reactive({
  currentPage: 1,
  pageTotal: 1,
  scale: 1,
  rotation: 0,
  title: '预览'
})
ViewConfig.scale = props.defaultScale
ViewConfig.title = props.title

function changPage(value) {
  if (ViewConfig.currentPage <= 1 && value < 0) return
  if (ViewConfig.currentPage >= ViewConfig.pageTotal && value > 0) return
  ViewConfig.currentPage += value
  renderCurrentPage()
}
const renderCurrentPage = throttle(async () => {
  if (!PDFInstance) return
  const page = await PDFInstance.getPage(ViewConfig.currentPage);
  //
  // Fetch the first page
  //
  const scale = ViewConfig.scale;
  const viewport = page.getViewport({ scale, rotation: ViewConfig.rotation });
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1;
  // Prepare canvas using PDF page dimensions
  const canvas = document.getElementById(CanvasId);
  const context = canvas.getContext("2d");
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";
  const transform = outputScale !== 1
    ? [outputScale, 0, 0, outputScale, 0, 0]
    : null;
  //
  // Render PDF page into canvas context
  //
  const renderContext = {
    canvasContext: context,
    transform,
    viewport,
  };
  page.render(renderContext);
}, 800, { leading: true })

function changScale(value) {
  if (ViewConfig.scale < 0.5 && value < 0) return
  if (ViewConfig.scale >= 3 && value > 0) return

  ViewConfig.scale = (ViewConfig.scale * 10 + value * 10) / 10
  renderCurrentPage()
}

function changeRotation(value) {
  ViewConfig.rotation += value
  renderCurrentPage()
}

async function init() {
  try {
    GlobalWorkerOptions.workerSrc = PdfWorkerSrc
    const loadingTask = getDocument(props.src);
    PDFInstance = await loadingTask.promise;
    ViewConfig.pageTotal = PDFInstance.numPages
    renderCurrentPage()
  } catch (err) {
    console.log(err);
  }
}

watch(() => props.src, newVal => {
  if (!newVal) return
  init()
}, {
  immediate: true
})

onUnmounted(() => PDFInstance = null)

</script>

<style lang="scss" scoped>
.pdf__view__container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .pdf__view__container__controller {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;

    .controller__btn {
      display: flex;
      align-items: center;
      cursor: pointer;

      .el-icon {
        margin: 0 4px;
      }

      .controller__label {
        width: 30px;
        text-align: center;
      }
    }
  }

  .pdf__view__container__body {
    flex: 1;
    overflow-y: scroll;

    .pdf__view__canvas__box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      height: max-content;
      min-width: 100%;
    }
  }
}
</style>