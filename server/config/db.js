/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:05:47
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 16:06:43
 * @FilePath: \notes-app\server\config\db.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createPool } from "mysql2/promise";
import "dotenv/config";

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;