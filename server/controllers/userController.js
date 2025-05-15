/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 16:07:16
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-14 20:48:56
 * @FilePath: \notes-app\server\controllers\userController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import pool from "../config/db.js";

// 注册用户
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, nickname, avatar_url } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password , content) VALUES (?, ?, ?, ?)",
      [username, email, password, "这里什么都没有~"]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 登录用户
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取用户信息
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//搜索用户
export const searchUser = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username LIKE ? OR nickname LIKE ?;",
      [`%${name}%`, `%${name}%`]
    );
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//关注
export const Watching = async (req, res) => {
  try {
    const { userId } = req.params;
    const watching = req.body;
    const [rows] = await pool.query(
      "UPDATE users SET watching = ? WHERE id = ?",
      [JSON.stringify(watching), userId]
    );

    if (rows.affectedRows > 0) {
      res.status(200).json({ success: true, watching: watching });
    } else {
      res.status(400).json({ error: "Update failed" });
    }
  } catch (error) {
    console.error("Watching update error:", error);
    res.status(500).json({ error: error.message });
  }
};

//修改个人信息
export const updateUser = async (req, res) => {
  try {
    const {
      id,
      nickname,
      password,
      avatar_url,
      content,
      birthday,
      show_notes,
    } = req.body;
    const [result] = await pool.query(
      "UPDATE users SET  nickname =?, password=? ,avatar_url =?, content =? ,birthday= ?,show_notes= ? WHERE id =?",
      [
        nickname,
        password,
        avatar_url,
        content,
        birthday,
        JSON.stringify(show_notes),
        id,
      ]
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//随机获取用户
export const getRandUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users ORDER BY RAND() LIMIT 9"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("处理随机用户失败:", error);
    res.status(500).json({ error: error.message });
  }
};
