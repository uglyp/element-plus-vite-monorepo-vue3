import { resolve } from "path";
import { defineConfig,loadEnv } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import DefineOptions from "unplugin-vue-define-options/vite";

import {
  projRoot,
  pkgRoot,
  compRoot,
  hookRoot,
  utilRoot,
} from "../build/utils/paths";

const CWD = process.cwd();

export default defineConfig(({ command, mode }) => {
  // 环境变量
  const { VITE_BASE_URL, VITE_APP_OUT_DIR } = loadEnv(mode, CWD);
  // const isBuild = command === 'build';

  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "~packages",
          replacement: resolve(pkgRoot),
        },
        {
          find: "~components",
          replacement: resolve(compRoot, "index.js"),
        },
        {
          find: "~hooks",
          replacement: resolve(hookRoot, "index.js"),
        },
        {
          find: "~utils",
          replacement: resolve(utilRoot, "."),
        },
      ],
    },
    plugins: [
      vue({
        // script: {
        //   refSugar: true // 开启 ref 语法糖
        // }
      }),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      legacy({
        targets: ["defaults", "not IE 11"],
      }),
      DefineOptions(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, "src/assets/icons")],
        // Specify symbolId format
        symbolId: "svg-icon-[dir]-[name]",
        /**
         * custom insert position
         * @default: body-last
         */
        inject: "body-last",
        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        customDomId: "__svg__icons__dom__",
      }),
    ],
    server: {
      host: "0.0.0.0",
      // port: 8088,
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:7001',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      //   }
      // }
    },
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    build: {
      outDir: VITE_APP_OUT_DIR,
      target: ["es2015", "chrome64"],
      assetsDir: "assets",
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: false,
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },
      rollupOptions: {
        output: {
          sourcemap: false,
          hoistTransitiveImports: true,
          // 全量打包引入的依赖
          // manualChunks: {
          //   chunkVueFamily: ['vue', 'vue-router', 'pinia', 'axios'],
          //   elementPlus: ['element-plus']
          // }
          // 按需打包引入的依赖
          manualChunks: (id, { getModuleInfo }) => {
            if (/(.*)\/node_modules\/(vue-router|pinia|axios)\/(.*)/.test(id)) {
              return 'chunk-vue-family'
            }
            if (/(.*)\/node_modules\/(element-plus)\/(.*)/.test(id)) {
              return 'chunk-element-plus'
            }
            if (/(.*)\/node_modules\/(wangeditor)\/(.*)/.test(id)) {
              return 'chunk-wangeditor'
            }
            if (/(.*)\/node_modules\/(pdfjs-dist)\/(.*)/.test(id)) {
              return 'chunk-pdfjs'
            }
            if (/(.*)\/node_modules\/(nprogress)\/(.*)/.test(id)) {
              return 'chunk-other-lib'
            }
            if (/(.*)\/node_modules\/(dayjs|lodash|mockjs|qs|mitt)\/(.*)/.test(id)) {
              return 'chunk-tools'
            }
          }
        }
      }
    },
  };
})
