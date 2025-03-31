/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:08:18
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:09:22
 * @FilePath: \notes-app\client\src\store\userStore.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { create } from 'zustand';

const userStore = create((set) => {
  // 从 localStorage 中读取用户信息
  const storedUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  return {
    user: storedUser,
    setUser: (user) => {
      set({ user });
      // 将用户信息存储到 localStorage
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: () => {
      set({ user: null });
      // 从 localStorage 中移除用户信息
      localStorage.removeItem('user');
    },
  };
});

export const useStore = userStore;
