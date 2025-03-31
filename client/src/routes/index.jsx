/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:17:26
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:45:24
 * @FilePath: \notes-app\client\src\routes\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import CategoryNotes from '@/pages/CategoryNotes';
import Notes from '@/pages/Notes';
import Note from '@/pages/Note';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/notes/categories/:categoryId" element={<CategoryNotes />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:id" element={<Note />} />
        </Routes>
    );
};

export default AppRoutes;