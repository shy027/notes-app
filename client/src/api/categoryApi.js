/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:07:02
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:07:23
 * @FilePath: \notes-app\client\src\api\categoryApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axiosInstance from './axiosInstance';

export const createCategory = async (categoryData) => {
  return axiosInstance.post('/categories', categoryData);
};

export const getCategories = async () => {
  return axiosInstance.get('/categories');
};

export const getCategory = async (categoryId) => {
  return axiosInstance.get(`/categories/${categoryId}`);
};

export const updateCategory = async (categoryId, categoryData) => {
  return axiosInstance.put(`/categories/${categoryId}`, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return axiosInstance.delete(`/categories/${categoryId}`);
};
