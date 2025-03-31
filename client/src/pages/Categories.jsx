/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:35:35
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:36:29
 * @FilePath: \notes-app\client\src\pages\Categories.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Categories = () => {
  const { navigate } = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };

    fetchCategoriesData();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>分类列表</h1>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={categories}
          renderItem={(item) => (
            <Card hoverable className="m-2">
              <Card.Meta title={item.name} />
              <a href={`/notes/categories/${item.id}`}>查看分类笔记</a>
            </Card>
          )}
        />
      </div>
    </>
  );
};

export default Categories;
