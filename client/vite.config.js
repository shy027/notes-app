/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 15:39:34
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-06 19:41:29
 * @FilePath: \notes-app\client\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
