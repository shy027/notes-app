/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-05-08 22:29:39
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-08 22:32:29
 * @FilePath: \notes-app\server\config\oss.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const OSS = require("ali-oss");

const client = new OSS({
  region: "oss-cn-nanjing",
  accessKeyId: "LTAI5t84FwGsGxU3CLAvGYDu",
  accessKeySecret: "YDudthWnZmUXj5t6hqnkYEjMf7uaQs",
  bucket: "class-practice",
});

module.exports = client;
