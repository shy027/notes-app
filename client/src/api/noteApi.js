/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:07:30
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-04 22:04:49
 * @FilePath: \notes-app\client\src\api\noteApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axiosInstance from './axiosInstance';

// 创建笔记
export const createNote = async (noteData) => {
  return axiosInstance.post('/notes', noteData);
};

// 查询某个用户的所有笔记
export const getNotes = async (userId) => {
  return axiosInstance.get(`/notes/user/${userId}`);
};

// 查询笔记详情
export const getNote = async (noteId) => {
  return axiosInstance.get(`/notes/${noteId}`);
};

// 查询某个用户某个分类的所有笔记
export const getNotesByCategory = async (userId, categoryId) => {
  return axiosInstance.get(`/notes/categories/${userId}/${categoryId}`);
};

// 更新笔记
export const updateNote = async (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

// 删除笔记
export const deleteNote = async (noteId) => {
  return axiosInstance.delete(`/notes/${noteId}`);
};

export const getAllNotes = async () => {
  return axiosInstance.get('/notes/all');
};

export const searchNotes = async (name) => {
  return axiosInstance.get(`/notes/search/${name}`);
};

export const updateNotePrivacy = async (noteId) => {
  return axiosInstance.post('/notes/private', { noteId: parseInt(noteId) });
};

export const getRandNotes = async () => {
  return axiosInstance.get('/notes/rand');
};
