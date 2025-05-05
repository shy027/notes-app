/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 17:06:02
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-04-30 22:52:46
 * @FilePath: \notes-app\client\src\api\axiosInstance.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://43.143.8.251:3000/api',
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

export default axiosInstance;
