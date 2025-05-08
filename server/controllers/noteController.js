/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:10:35
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-07 16:05:15
 * @FilePath: \notes-app\server\controllers\noteController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags, isPrivate } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags,isPrivate) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, title, content, categoryId, JSON.stringify(tags), isPrivate]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
      isPrivate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [
      userId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记列表
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ?",
      [userId, categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, tags, isPrivate } = req.body;
    await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? ,isPrivate = ? WHERE id = ?",
      [title, content, categoryId, JSON.stringify(tags), isPrivate, id]
    );
    res.status(200).json({ id, title, content, categoryId, tags, isPrivate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取所有笔记
export const getAllNotes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT * FROM notes
        `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//搜索笔记
export const searchNotes = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE title LIKE ?", [
      `%${name}%`,
    ]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//修改私有公开
export const updateNotePrivacy = async (req, res) => {
  try {
    const { noteId } = req.body;
    console.log("收到的请求数据:", { noteId, type: typeof noteId });

    const [result] = await pool.query(
      "UPDATE notes SET isPrivate = CASE WHEN isPrivate = 1 THEN 0 WHEN isPrivate = 0 THEN 1 END WHERE id = ?",
      [noteId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "更新成功" });
    } else {
      res.status(404).json({ error: "笔记不存在" });
    }
  } catch (error) {
    console.error("SQL错误:", error);
    res.status(500).json({ error: error.message });
  }
};

//随机获取公开笔记
export const getRandNotes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE isPrivate = 0 ORDER BY RAND() LIMIT 9"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("处理随机笔记失败:", error);
    res.status(500).json({ error: error.message });
  }
};

//根据分类获取所有相关笔记
export const getAllNotesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE category_id = ? AND isPrivate = 0",
      [categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("获取分类笔记失败:", error);
    res.status(500).json({ error: error.message });
  }
};
