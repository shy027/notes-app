/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 15:56:46
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-04-30 22:55:39
 * @FilePath: \notes-app\server\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 15:56:46
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-04-01 17:44:58
 * @FilePath: \notes-app\server\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

// 允许特定源，并设置 Access-Control-Allow-Credentials
// const allowedOrigins = ["http://43.143.8.251:8080"];
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "这个网站的跨域资源共享（CORS）策略不允许从指定的来源进行访问。";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // 允许发送 Cookies
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
