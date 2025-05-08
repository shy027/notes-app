/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:13:50
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-06 20:34:52
 * @FilePath: \notes-app\server\routes\userRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  searchUser,
  Watching,
  updateUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.get("/search/:name", searchUser);
router.put("/watching/:userId", Watching);
router.post("/updateUser", updateUser)

export default router;
