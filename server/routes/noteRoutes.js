/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:14:06
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 16:21:04
 * @FilePath: \notes-app\server\routes\noteRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEcre
 */
import express from "express";
import { createNote,getNotes,getNote,updateNote,deleteNote,getNotesByCategory } from "../controllers/noteController.js";

const router = express.Router();

router.post("/",createNote);
router.get("/user/:userId",getNotes)
router.get("/:id",getNote)
router.get("/categories/:userId/:categoryId",getNotesByCategory)
router.put("/:id",updateNote)
router.delete("/:id",deleteNote)

export default router