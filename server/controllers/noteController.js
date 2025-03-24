/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:10:35
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 16:11:57
 * @FilePath: \notes-app\server\controllers\noteController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
    try {
        const { userId, title, content, categoryId, tags } = req.body;
        const [result] = await pool.query(
            "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
            [userId, title, content, categoryId, JSON.stringify(tags)]
        );
        res.status(201).json({
            id: result.insertId,
            userId,
            title,
            content,
            categoryId,
            tags,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [userId]);
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
        const { title, content, categoryId, tags } = req.body;
        await pool.query(
            "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? WHERE id = ?",
            [title, content, categoryId, JSON.stringify(tags), id]
        );
        res.status(200).json({ id, title, content, categoryId, tags });
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