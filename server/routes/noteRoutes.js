/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:14:06
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-04 22:01:22
 * @FilePath: \notes-app\server\routes\noteRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEcre
 */
import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  getAllNotes,
  searchNotes,
  updateNotePrivacy,
  getRandNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/all", getAllNotes);
router.get("/rand", getRandNotes);
router.post("/", createNote);
router.get("/user/:userId", getNotes);
router.get("/:id", getNote);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/search/:name", searchNotes);
router.post("/private", updateNotePrivacy);


export default router;
