/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:05:49
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-08 20:08:23
 * @FilePath: \notes-app\client\src\api\userApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  return axiosInstance.post('/users/register', userData);
};

export const loginUser = async (userData) => {
  return axiosInstance.post('/users/login', userData);
};

export const getUser = async (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};

export const searchUser = async (name) => {
  return axiosInstance.get(`/users/search/${name}`);
};

export const Watching = async (userId, watching) => {
  console.log(watching);

  return axiosInstance.put(`/users/watching/${userId}`, watching);
};

export const updateUser = async (userData) => {
  return axiosInstance.post(`/users/updateUser`, userData);
};

export const getRandUsers = async () => {
  return axiosInstance.get('/users/rand-users');
};
