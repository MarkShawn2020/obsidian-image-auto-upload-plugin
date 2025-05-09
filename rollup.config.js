import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import fs from 'fs';
import path from 'path';

// 确保 dist 目录存在
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 定义需要复制到 dist 目录的文件
const filesToCopy = ['manifest.json', 'styles.css', 'data.json'];

// 复制文件的插件
const copyFilesPlugin = {
  name: 'copy-files',
  buildEnd() {
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        const dest = path.join(distDir, path.basename(file));
        fs.copyFileSync(file, dest);
        console.log(`Copied ${file} to ${dest}`);
      } else {
        console.warn(`File ${file} not found, skipping copy`);
      }
    });
  }
};

export default {
  input: "src/main.ts",
  output: {
    file: path.join(distDir, 'main.js'),
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
  },
  external: ["obsidian", "electron"],
  plugins: [typescript(), nodeResolve({ browser: false }), commonjs(), json(), copyFilesPlugin],
};
