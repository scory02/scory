import { defineConfig, loadEnv, createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import path, { resolve } from "path";
import inject from "@rollup/plugin-inject"; // 必须重要！效果和webpack.ProvidePlugin中相同
import { visualizer } from "rollup-plugin-visualizer";
import vitePluginImp from "vite-plugin-imp";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import commpressPlugin from "vite-plugin-compression";
import Unocss from "unocss/vite"; // 引入Unocss
import { presetUno, presetAttributify, presetIcons } from "unocss";

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue({ reactivityTransform: true }),
      inject({
        /* $: "jquery",
        _: "lodash", */
      }),
      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [NaiveUiResolver()],
      }),
      Components({
        dts: true,
        dirs: ["src/components", "src/views"], // 按需加载的文件夹
        resolvers: [NaiveUiResolver()],
      }),
      commpressPlugin({
        //开启gzip压缩
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      vitePluginImp({
        libList: [
          {
            libName: "lodash",
            libDirectory: "",
            camel2DashComponentName: false,
          },
        ],
      }),
      Unocss({
        // 使用Unocss
        presets: [presetUno(), presetAttributify(), presetIcons()],
      }),
    ],
    base: loadEnv(mode, process.cwd()).VITE_APP_NAME,
    resolve: {
      alias: {
        //别名设置
        "@": resolve(__dirname, "src"),
        "~": resolve(__dirname, "public"),
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      assetsInlineLimit: "4096", // 小于此阈值的导入或引用资源将内联为 base64 编码
      rollupOptions: {
        plugins: [visualizer()],
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
      minify: "terser", // 必须启用：terserOptions配置才会有效
      terserOptions: {
        compress: {
          // 生产环境时移除console.log调试代码
          /* drop_console: true, */
          drop_debugger: true,
        },
      },
    },
  });
};
